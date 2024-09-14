const path = require('path');
const RoomModel = require('../models/roomModel'); 
const Intern = require('../utils/intern'); 


exports.getRoomsPage = (req, res) => {

    const roomModel = new RoomModel();

    // roomModel.createRoom("Odeio acordar cedo", "", "123456", 0, 1);
    //roomName, image = "",password = "", private = 0, creatorId

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
                room: Intern.encrypt(room.room),
                room_name: room.room_name,
                image: room.room_image,
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