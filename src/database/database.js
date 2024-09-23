const mysql = require('mysql2/promise');
const config = require('../config/config');
const mysql_config = config.mysql_config;

class Database {
    constructor() {
        this.config = mysql_config;
        this.connection = null;
    }

    // Método para conectar ao banco de dados
    async connect() {
        if (this.connection) {
            console.log('Já está conectado ao banco de dados.');
            return;
        }
        try {
            this.connection = await mysql.createConnection(this.config);
            console.log('Conectado ao banco de dados MySQL!');
        } catch (err) {
            console.error('Erro ao conectar ao banco de dados:', err);
            throw err;
        }
    }

    async disconnect() {
        if (!this.connection) {
            console.log('Nenhuma conexão com o banco de dados para fechar.');
            return;
        }
        try {
            await this.connection.end();
            this.connection = null;
            console.log('Conexão fechada.');
        } catch (err) {
            console.error('Erro ao fechar a conexão:', err);
            throw err;
        }
    }

    // Método para executar uma consulta
    async executeQuery(query, params = []) {
        if (!this.connection) {
            throw new Error('Não há conexão com o banco de dados.');
        }

        try {
            const [results] = await this.connection.execute(query, params);
            return {
                status: 'success',
                affected_rows: this.getAffectedRows(query, results),
                query,
                results
            };
        } catch (err) {
            console.error('Erro ao executar a consulta:', err);
            return {
                status: 'error',
                affected_rows: null,
                query,
                results: null
            };
        }
    }

    // Método para obter o número de linhas afetadas
    getAffectedRows(query, results) {
        if (/^(INSERT|UPDATE|DELETE)/i.test(query)) {
            return results.affectedRows;
        }
        return null;
    }

    // Método para executar uma consulta de leitura (SELECT)
    async select(query, params = []) {
        const result = await this.executeQuery(query, params);
        if (result.status === 'success') {
            return result.results;
        }
        throw new Error('Erro ao executar consulta SELECT.');
    }

    // Método para executar uma consulta de escrita (INSERT, UPDATE, DELETE)
    async modify(query, params = []) {
        const result = await this.executeQuery(query, params);
        if (result.status === 'success') {
            return result.affected_rows;
        }
        throw new Error('Erro ao executar consulta de modificação.');
    }
}

module.exports = Database;
