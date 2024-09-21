const Database = require('../database/database');
const RoomModel = require('../models/roomModel');
const Intern = require('../utils/intern');
const moment = require('moment');

const bcrypt = require('bcrypt');
const { resolveInclude } = require('ejs');
const saltRounds = 10;


class roomModel extends Database {
    constructor() {
        super();
    }

    async createRoom(roomName, image = "", roomPassword = "", privateRoom = 0, creatorId) {

        await this.connect();

        if (roomPassword != "") {
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
        if (offSet && Number.isInteger(offSet)) {
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
            await this.disconnect();
        }
    }

    async createMessage(roomId, userId, message, timestamp) {

        await this.connect();

        const formattedTimestamp = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');

        try {

            const query = 'INSERT INTO messages (room_id, user_id, message, sent_on) VALUES (?, ?, ?, ?)';

            const params = [Intern.decrypt(roomId), Intern.decrypt(userId), message, formattedTimestamp];

            let results = await this.modify(query, params);
            this.disconnect();

            return results

        } catch (err) {

            this.disconnect();
            console.error('Erro ao mensagem sala:', err);
            throw err;

        }
    }

    async getMessages(roomId, limit = 10, offset = 0) {
        // Verifica se o roomId foi passado
        if (!roomId) {
            throw new Error('O roomId é obrigatório para buscar mensagens.');
        }

        // Garantindo que limit e offset sejam números válidos
        limit = parseInt(limit, 10);
        offset = parseInt(offset, 10);

        if (isNaN(limit) || limit <= 0) {
            limit = 10;  // Limite padrão
        }
        if (isNaN(offset) || offset < 0) {
            offset = 0;  // Offset padrão
        }

        // Query SQL para buscar as mensagens das últimas 24 horas
        const query = `
            SELECT 
                messages.id AS message_id,
                messages.message AS message, 
                messages.sent_on AS sent_on, 
                users.name AS user_name, 
                users.id AS user_id 
            FROM messages 
            RIGHT JOIN users ON messages.user_id = users.id 
            WHERE messages.room_id = ?
            AND messages.sent_on >= NOW() - INTERVAL 1 DAY
            ORDER BY message_id ASC
        `;

        const params = [roomId];

        try {
            // Conectar ao banco de dados
            await this.connect();

            // Executa a query e retorna os resultados
            const results = await this.select(query, params);

            console.log(results);

            if (results.length === 0) {
                console.warn(`Nenhuma mensagem encontrada nas últimas 24 horas para a sala: ${roomId}`);
            }

            return results;

        } catch (err) {
            console.error(`Erro ao buscar mensagens para a sala ${roomId}:`, err.message);
            throw new Error('Erro ao buscar mensagens. Tente novamente mais tarde.');

        } finally {
            // Desconectar do banco de dados, independente do sucesso ou falha
            await this.disconnect();
        }
    }


}

module.exports = roomModel;
