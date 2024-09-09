import { processCommands } from "./chat.js";

document.addEventListener('DOMContentLoaded', () => {
    
    const onlineUsersDiv = document.querySelector(".online-users");


    const userData = JSON.parse(localStorage.getItem('user')) || {};

    if (!userData.name) {
        userData.name = window.prompt("Coloca seu nome aí po");
        userData.profilePic = window.prompt("Quer colocar uma imagem de perfil? (a imagem deve estar hospedada)");
        
        localStorage.setItem('user', JSON.stringify(userData));
    }


    const quitBtn = document.querySelector(".quit");

    quitBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = "./"
    });


    let socket = io('https://0007-2804-3e60-4cf-3800-9a3c-576c-833b-a4c5.ngrok-free.app');
    
    const messagesDiv = document.querySelector('.messages');

    function scrollToBottom() {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    socket.on("userQtd", (usersQtd) => {
        onlineUsersDiv.textContent = usersQtd;
    });
    
    socket.on('connect', () => {

        socket.emit('user_data', userData.name);

        socket.on("user_entry", (user) => {
            messagesDiv.innerHTML += `<p><strong>${user} Entrou na sala.</strong></p>`;
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
       
    });

    document.querySelector("#chat").addEventListener('submit', (e) => {
        e.preventDefault();

        let author = userData.name;
        let message = document.querySelector("#message").value.trim();
        let profilePic = userData.profilePic;

        if (author.length && message.length) {
            let messageObj = {
                author: author,
                profilePic: profilePic,
                message: message
            };
            socket.emit('sendMessage', messageObj);
            document.querySelector("#message").value = "";
        }

        scrollToBottom();
    });
});
