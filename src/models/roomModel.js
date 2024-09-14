const Database = require('../database/database'); 
const bcrypt = require('bcrypt');
const saltRounds = 10; 



class roomModel extends Database {
    constructor() {
        super();
    }

    async createRoom(roomName, image = "", roomPassword = "", privateRoom = 0, creatorId) {

        await this.connect();
         
        if(roomPassword != "") {
            roomPassword = await bcrypt.hash(roomPassword, saltRounds);
        }

        try {
            const query = 'INSERT INTO rooms (name, image, password, private, creator_id) VALUES (?, ?, ?, ?, ?)';

            const params = [roomName, image, roomPassword, privateRoom, creatorId];

            let results = await this.modify(query, params);
            this.disconnect();
            return results

        } catch (err) {
            this.disconnect();
            console.error('Erro ao criar sala:', err);
            throw err;
            
        }
    }



    async getRooms(rowLimit = null, offSet = null) {
        /*
            Busca as salas no banco de dados
        */
        await this.connect(); // Aguarda a conexão ser estabelecida        
        
        let query = 'SELECT rooms.id AS room, rooms.image AS image, rooms.name AS room_name, rooms.last_update AS rooms_last_update, rooms.create_at AS room_created_at, rooms.private AS private, users.name AS creator FROM rooms JOIN users ON users.id = creator_id';
        let params = [];

        // ordem decrescente das salas
        query += " ORDER BY rooms.id DESC";

        // limite de dados do select se for passado na funcao
        if (rowLimit && Number.isInteger(rowLimit)) {
            query += ' LIMIT ?';
            params.push(rowLimit);
        }

        // adiciona offset, se for passado na funcao
        if(offSet && Number.isInteger(offSet)) {
            query += ` OFFSET ?`;
            params.push(offSet);
        }

        try {
        
            let results = await this.select(query, params);
            
            return results;
        
        } catch (err) {
        
            console.error('Erro ao buscar salas:', err);
            throw err;
        
        } finally {
            await this.disconnect(); // Garante que a conexão seja fechada
        }
    }

}

module.exports = roomModel;
