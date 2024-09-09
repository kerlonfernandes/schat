document.addEventListener('DOMContentLoaded', () => {
    
    const userData = JSON.parse(localStorage.getItem('user')) || {};

    if (!userData.name) {
        userData.name = window.prompt("Coloca seu nome aí po");
        
        localStorage.setItem('user', JSON.stringify(userData));
    }

    let socket = io('https://0007-2804-3e60-4cf-3800-9a3c-576c-833b-a4c5.ngrok-free.app');
    
    const messagesDiv = document.querySelector('.messages');

    socket.on('connect', () => {
        
        socket.emit('user_data', userData.name);

        socket.on("user_entry", (user) => {
            messagesDiv.innerHTML += `<p><strong>${user} Entrou na sala.</strong></p>`;
            window.scrollTo(0, document.body.scrollHeight);
        });

        socket.on('receiveMessage', (data) => {
            messagesDiv.innerHTML += `<p><strong>${data.author}:</strong> ${data.message.slice(0, 300)}</p>`;
            window.scrollTo(0, document.body.scrollHeight);
        
        });
       
    });

    document.querySelector("#chat").addEventListener('submit', (e) => {
        e.preventDefault();

        let author = userData.name;
        let message = document.querySelector("#message").value.trim();

        if(message == "/change-name") {
            userData.name = window.prompt("Coloca seu nome aí po");
        
            localStorage.setItem('user', JSON.stringify(userData));
        }

        if (author.length && message.length) {
            let messageObj = {
                author: author,
                message: message
            };
            window.scrollTo(0, document.body.scrollHeight);
            socket.emit('sendMessage', messageObj);
        }

        document.querySelector("#message").value = "";
    });
});
