import { processCommands } from "./scripts.js";
import socket from '../index.js';
import { Effects } from "../styles/effects.js";

class ChatPage {

    constructor() {
        this.existingMessages = new Set();
        this.isLoading = false; // Flag para controlar o estado de carregamento
        this.offset = 0; // Inicialize o offset
        this.#init();
    }

    #init() {
        this.roomId = localStorage.getItem('currentRoomId');
        this.userData = JSON.parse(localStorage.getItem('user')) || {};

        if (!this.userData.name) {
            this.userData.name = window.prompt("Coloque seu nome aí po");
            this.userData.profilePic = window.prompt("Quer colocar uma imagem de perfil? caso não queira, apenas deixe o campo vazio. (a imagem deve estar hospedada)");

            localStorage.setItem('user', JSON.stringify(this.userData));
        }

        if (!this.roomId) {
            window.location.href = "/rooms";
            return;
        }

        this.currentRoom = null;

        this.onlineUsersDiv = document.querySelector(".online-users");
        this.quitBtn = document.querySelector(".quit");
        this.messagesDiv = document.querySelector('.messages');
        this.chatForm = document.querySelector("#chat");
        this.messageInput = document.querySelector("#message");

        this.#run();
    }

    async #run() {
        this.socketEvents();
        this.quitBtnAction();
        this.setupScrollListener();
        await this.loadMessages(); // Certifique-se de esperar a primeira carga
    }

    socketEvents() {
        socket.on('connect', () => {
            this.emitJoinRoom();
            this.onUpdateOnlineUsers();
            this.onUserExit();
            this.onReceiveMessage();
            this.sendMessage();
        });
    }

    emitJoinRoom() {
        socket.emit('joinRoom', this.roomId, this.userData);
    }

    onUpdateOnlineUsers() {
        socket.on('updateOnlineUsers', (data) => {
            this.onlineUsersDiv.innerHTML = `${data.count}`;
        });
    }

    onUserExit() {
        socket.on('user_exit', (message) => {
            this.messagesDiv.innerHTML += `<p><strong>${message}</strong></p>`;
            Effects.scrollToBottom();
        });
    }

    onReceiveMessage() {
        socket.on('receiveMessage', (data) => {
            this.messagesDiv.innerHTML += `
                <div class="card message-card m-4">
                    <div class="card-body d-flex align-items-center">
                        ${data.profilePic ? `<img src="${data.profilePic}" alt="Profile Picture"
                             class="profile-pic" height="100" width="100"
                                style="border-radius:50%;">` : ''

                }
                        <div class="username ms-3">${data.author}</div>
                    </div>
                    <hr>
                    <div class="card-body">
                        <p>${data.message.slice(0, 300)}</p>
                    </div>
                </div>
                `;
            Effects.scrollToBottom();
        });
    }

    quitBtnAction() {
        this.quitBtn.addEventListener('click', () => {
            if (socket) {
                socket.emit('leaveRoom', this.roomId);
            }
            localStorage.clear();
            window.location.href = "/rooms";
        });
    }

    sendMessage() {

        this.chatForm.addEventListener('submit', (e) => {

            e.preventDefault();

            let author = this.userData.name;
            let message = this.messageInput.value.trim();
            let profilePic = this.userData.profilePic;

            const currentTimestamp = Date.now();

            if (author.length && message.length) {
                let messageObj = {
                    user: 1,
                    author: author,
                    profilePic: profilePic,
                    message: message,
                    timestamp: currentTimestamp
                };

                socket.emit('sendMessage', this.roomId, messageObj);

                this.messageInput.value = "";
                Effects.scrollToBottom();
            }
        });
    }

    setupScrollListener() {
        this.messagesDiv.addEventListener('scroll', () => {
            if (this.messagesDiv.scrollTop === 0 && !this.isLoading) {
                this.loadMessages();
            }
        });
    }

    async loadMessages() {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            this.offset += 10;

            socket.emit('getMessages', { roomId: this.roomId, limit: 10, offset: this.offset }, (data) => {
                if (data && data.status === "success" && data.messages.length) {
                    let newMessages = data.messages.filter(msg => !this.existingMessages.has(msg.id));

                    if (newMessages.length) {
                        let messagesHtml = newMessages.map(msg => {
                            this.existingMessages.add(msg.id);
                            return `
                                <div class="card message-card m-4">
                                    <div class="card-body d-flex align-items-center">
                                        ${msg.profilePic ? `<img src="${msg.profilePic}" 
                                            alt="Profile Picture" class="profile-pic" height="100" width="100" style="border-radius:50%;">` : ''}
                                        <div class="username ms-3">${msg.author}</div>
                                    </div>
                                    <hr>
                                    <div class="card-body"> 
                                        <p>${msg.message.slice(0, 300)}</p>
                                    </div>
                                </div>
                            `;
                        }).join('');

                        const currentScrollTop = this.messagesDiv.scrollTop;

                        this.messagesDiv.innerHTML = messagesHtml + this.messagesDiv.innerHTML;

                        // Ajuste da rolagem com comportamento suave
                        this.messagesDiv.scrollTo({
                            top: this.messagesDiv.scrollHeight - currentScrollTop - this.messagesDiv.clientHeight,
                            behavior: 'smooth'
                        });
                    }
                } else {
                    console.log(data.message || 'Nenhuma mensagem encontrada.');
                }
            });
        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
        } finally {
            this.isLoading = false;
        }
    }




    beforeUnload() {
        window.addEventListener('beforeunload', () => {
            if (socket) {
                socket.emit('leaveRoom', this.roomId);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatPage();
});
