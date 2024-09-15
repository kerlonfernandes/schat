const Database = require('../database/database'); // Certifique-se de que o caminho está correto
const bcrypt = require('bcrypt');
const saltRounds = 10; 

class UserModel extends Database {
    constructor() {
        super(); 
    }

    async createUser(username, email, password) {
        this.connect();
         
        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
            const params = [username, email, hashedPassword];

            let results = await this.modify(query, params);
            this.disconnect();
            return results

        } catch (err) {
            this.disconnect();
            console.error('Erro ao criar usuário:', err);
            throw err;
            
        }
    }

    async checkPassword(userId, password) {
        try {
            const query = 'SELECT password FROM users WHERE id = ?';
            const params = [userId];
            const result = await this.select(query, params);

            if (result.results.length === 0) {
                throw new Error('Usuário não encontrado');
            }

            const hashedPassword = result.results[0].password;
            const match = await bcrypt.compare(password, hashedPassword);

            return match; 
        } catch (err) {
            console.error('Erro ao verificar senha:', err);
            throw err;
        }
    }

    async getUserById(userId) {
        const query = 'SELECT * FROM users WHERE id = ?';
        const params = [userId];
        return await this.select(query, params);
    }

    async updateUser(userId, username, email, password) {
        const query = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
        const params = [username, email, password, userId];
        return await this.modify(query, params);
    }

    async deleteUser(userId) {
        const query = 'DELETE FROM users WHERE id = ?';
        const params = [userId];
        return await this.modify(query, params);
    }
}

module.exports = UserModel;
