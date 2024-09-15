const path = require('path');
const RoomModel = require('../models/roomModel'); 
const Intern = require('../utils/intern'); 

exports.getRoomsPage = (req, res) => {

    res.sendFile(path.join(__dirname, '../../public/views/rooms.html'));

};

exports.fetchRooms = async (req, res) => {

    const roomModel = new RoomModel();

    try {

        let roomsData = await roomModel.getRooms();

        let response = {
            status: "success",
            rooms: []
        };


        if (roomsData.length > 0) {
            response.rooms = roomsData.map(room => ({
                room: room.room,
                room_name: room.room_name,
                image: room.image,
                is_private: room.private == 1,
                creator: room.creator,
                created_at: room.room_created_at
            }));

            return res.json(response);
            
        }
       
        response.message = "Nenhum resultado encontrado";

        return res.json(response);
        
    } catch (err) {
        console.log(err);
        res.status(500).send('Erro interno do servidor');
    }


}


exports.getMessages = async (req, res) => {
    const { roomId } = req.query;
    const limit = parseInt(req.query.limit, 10) || 10; 
    const offset = parseInt(req.query.offset, 10) || 0; 

    if (!roomId) {
        return res.status(400).json({ status: "error", message: "roomId é necessário" });
    }

    const messageModel = new RoomModel();

    try {
        let messagesData = await messageModel.getMessages(roomId, limit, offset);

        let response = {
            status: "success",
            messages: messagesData.map(message => ({
                id: message.id, // Inclua o ID único aqui
                message: message.message,
                sent_on: message.sent_on,
                author: message.user_name,
                profilePic: message.profilePic
            }))
        };

        if (messagesData.length > 0) {
            return res.json(response);
        }

        response.message = "Nenhuma mensagem encontrada";
        return res.json(response);
        
    } catch (err) {
        console.log(err);
        res.status(500).send('Erro interno do servidor');
    }
};
