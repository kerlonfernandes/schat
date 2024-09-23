import { Effects } from '../styles/effects.js';
import socket from '../index.js'; 

class Page {

    constructor() {
        this.#init();
    }

    #init() {
        this.roomsList = [];
        this.currentRoom = null;
        this.chatList = document.querySelector('.chat-list');
        this.totalUsersDiv = document.querySelector('.online-users'); 

        this.#run();
    }

    async #run() {
        await this.fetchChats();
        this.loadChats();
        this.socketEvents();
    }

    socketEvents() {
        this.joinedRoom();
        this.updateTotalUserCount(); 
    }

    showOverlay() {
        Effects.createDivWithClass('overlay', document.querySelector('.main-content'));
        Effects.createDivWithClass('spinner', document.querySelector('.overlay'));
    }

    async fetchChats() {
        try {
            const response = await fetch('/fetch/rooms', {
                method: 'GET'
            });
            const result = await response.json();

            if (result.status !== "success") {
                return;
            }

            if (result.rooms) {
                this.roomsList = result.rooms;
            }
        } catch (err) {
            console.error('Error fetching chats:', err);
        }
    }

    loadChats() {

        // Clear existing chat list
        this.chatList.innerHTML = '';

        this.roomsList.forEach(room => {
            // Create chat item container
            const chatItem = document.createElement('div');
            chatItem.classList.add('chat-item');

            // Create chat image
            const chatImage = document.createElement('img');
            chatImage.src = room.image ? "/images/" + room.image : "/images/no-image.png"; 
            chatImage.alt = room.room_name;
            chatImage.classList.add('chat-image');

            // Create chat info container
            const chatInfo = document.createElement('div');
            chatInfo.classList.add('chat-info');

            // Create chat name
            const chatName = document.createElement('h2');
            chatName.classList.add('chat-name');
            chatName.textContent = room.room_name;

            // Create chat date
            const chatDate = document.createElement('p');
            chatDate.classList.add('chat-date');
            chatDate.textContent = `Data de criação: ${new Date(room.created_at).toLocaleDateString()}`;

            // Create chat author
            const chatAuthor = document.createElement('p');
            chatAuthor.classList.add('chat-author');
            chatAuthor.textContent = `Criado por: ${room.creator}`;

            // Append info to chatInfo
            chatInfo.appendChild(chatName);
            chatInfo.appendChild(chatDate);
            chatInfo.appendChild(chatAuthor);

            // Create join button
            const joinButton = document.createElement('button');
            joinButton.setAttribute('room', room.room);
            joinButton.classList.add('join-button');
            joinButton.textContent = 'Entrar';

            // Add event listener for the join button
            joinButton.addEventListener('click', (e) => {
                const id = e.target.getAttribute('room');
                this.joinRoom(id);
            });

            // Append all elements to chatItem
            chatItem.appendChild(chatImage);
            chatItem.appendChild(chatInfo);
            chatItem.appendChild(joinButton);

            // Append chatItem to chatList
            this.chatList.appendChild(chatItem);
        });
    }

    joinRoom(roomId) {
        if(this.currentRoom) {
            this.leaveRoom(this.currentRoom);
        }

        console.log(`Joining room: ${roomId}`);
        socket.emit('joinRoom', roomId, {user: 1});
    }

    leaveRoom(currentRoom) {
        if (currentRoom) {
            console.log(`Leaving room: ${currentRoom}`);
            socket.emit('leaveRoom', currentRoom);
    
            localStorage.removeItem('currentRoomId');
        }
    }

    joinedRoom() {
        socket.on('joinedRoom', (roomId, roomExists) => {
            console.log(`Joined room event received. Room ID: ${roomId}, Exists: ${roomExists}`);

            if(!roomExists) {
                console.log('Room does not exist.');
                return; // room doesn't exist
            }

            this.currentRoom = roomId;  
            localStorage.setItem('currentRoomId', roomId);
            window.location.href = `/chat/${roomId}`;
        });
    }

    startHeartbeat() {
        this.lastHeartbeat = Date.now();
        this.heartbeatInterval = setInterval(() => {
            if (Date.now() - this.lastHeartbeat > 5000) {
                console.log('Connection seems to be lost.');
            }
            console.log('Sending heartbeat...');
            socket.emit('heartbeat');
        }, 5000); 
    }

    stopHeartbeat() {
        clearInterval(this.heartbeatInterval);
    }

    updateTotalUserCount() {
        socket.on('totalUserCount', (totalCount) => {
            console.log(`Total users online: ${totalCount}`);
            this.totalUsersDiv.textContent = `${totalCount}`;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Page();
    Effects.hideElement('.overlay', '3');
});
