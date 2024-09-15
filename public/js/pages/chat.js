import { processCommands } from "./scripts.js";

document.addEventListener('DOMContentLoaded', () => {
    const onlineUsersDiv = document.querySelector(".online-users");
    const quitBtn = document.querySelector(".quit");
    const messagesDiv = document.querySelector('.messages');
    const chatForm = document.querySelector("#chat");
    const messageInput = document.querySelector("#message");

    let socket;

    const userData = JSON.parse(localStorage.getItem('user')) || {};

    if (!userData.name) {
        userData.name = window.prompt("Coloque seu nome aí po");
        userData.profilePic = window.prompt("Quer colocar uma imagem de perfil? caso não queira, apenas deixe o campo vazio. (a imagem deve estar hospedada)");

        localStorage.setItem('user', JSON.stringify(userData));
    }

    const roomId = localStorage.getItem('currentRoomId');

    if (!roomId) {
        window.location.href = "/rooms";
        return;
    }

    function scrollToBottom() {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // Inicializa o socket
    socket = io('http://localhost:3000');

    socket.on('connect', () => {
        // Emitir o roomId ao se conectar
        socket.emit('joinRoom', roomId, userData);

        socket.on('updateOnlineUsers', (data) => {
            onlineUsersDiv.innerHTML = `<p><strong>Online Users:</strong> ${data.count}</p>`;
            
        });
        
        socket.on('totalUserCount', (totalCount) => {
            totalUsersDiv.textContent = `Total Users Online: ${totalCount}`;
        });
        
        socket.on('user_exit', (message) => {
            messagesDiv.innerHTML += `<p><strong>${message}</strong></p>`;
            scrollToBottom();
        });

        socket.on('receiveMessage', (data) => {
            messagesDiv.innerHTML += `
            <div class="card message-card m-4">
                <div class="card-body d-flex align-items-center">
                    ${data.profilePic ? `<img src="${data.profilePic}" alt="Profile Picture" class="profile-pic" height="100" width="100" style="border-radius:50%;">` : ''}
                    <div class="username ms-3">${data.author}</div>
                </div>
                <hr>
                <div class="card-body"> 
                    <p>${data.message.slice(0, 300)}</p>
                </div>
            </div>
            `;
            scrollToBottom();
        });

        quitBtn.addEventListener('click', () => {
            if (socket) {
                socket.emit('leaveRoom', roomId); // Informar ao servidor que está saindo da sala
            }
            localStorage.clear();
            window.location.href = "./";
        });

        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let author = userData.name;
            let message = messageInput.value.trim();
            let profilePic = userData.profilePic;
            const currentTimestamp = Date.now();

            if (author.length && message.length) {
                let messageObj = {
                    user: 1,
                    author: author,
                    profilePic: profilePic,
                    message: message,
                    timestamp: currentTimestamp
                };

                socket.emit('sendMessage', roomId, messageObj);

                messageInput.value = "";
                scrollToBottom();
            }
        });
    });

    window.addEventListener('beforeunload', () => {
        if (socket) {
            socket.emit('leaveRoom', roomId);
        }
    });

});
