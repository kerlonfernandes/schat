

export function processCommands() {
    
}


document.addEventListener('DOMContentLoaded', () => {
    let input = document.querySelector("#message");
    
    input.addEventListener("input", (e) => {
        let text = input.value.trim();
        
        let data = text.split(' '); 
        let command = data[0];
        
        if (command === "/link" && data[1] && data[1].startsWith("https://") && data[2]) {
            let linkHTML = `<a href="${data[1]}" target="_blank">${data[2]}</a>`;
            
            input.value = linkHTML;
        }
    });
});

