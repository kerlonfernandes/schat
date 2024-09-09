document.addEventListener('DOMContentLoaded', () => {
    
    let name = window.prompt("Coloca seu nome aí po")
    // https://2a96-2804-3e60-4b4-5700-12b9-6d9d-b8aa-2e4b.ngrok-free.app
    let socket = io('https://2a96-2804-3e60-4b4-5700-12b9-6d9d-b8aa-2e4b.ngrok-free.app');
   
    socket.on('connect', () => {
        console.log('Connected to server');

        socket.on('receiveMessage', (data) => {
            const messagesDiv = document.querySelector('.messages');
            messagesDiv.innerHTML += `<p><strong>${data.author}:</strong> ${data.message.slice(0, 300)}</p>`;
        });

    });

    document.querySelector("#chat").addEventListener('submit', (e) => {

        e.preventDefault();

        let author = name;

        let message = document.querySelector("#message").value;

        if (author.length && message.length) {
            let messageObj = {
                author: author,
                message: message
            }

            socket.emit('sendMessage', messageObj);
        }

        document.querySelector("#message").value = "";
    });

});

