export class Effects {

    static hideElement(elementSelector, duration = "500") {
        const element = document.querySelector(elementSelector);

        element.style.transition = `opacity ${duration}ms ease-out`;
        element.style.opacity = 0;

        element.classList.add('fade-hidden');
    }

    static showElement(elementSelector, duration = "500") {
        const element = document.querySelector(elementSelector);

        element.style.transition = `opacity ${duration}ms ease-in`;
        element.style.opacity = 1;

        element.classList.remove('fade-hidden');
    }

    static createDivWithClass(nameClass, div) {
        let element = document.createElement('div');
        element.className = nameClass; 
    
        div.appendChild(element);
    }

    static scrollToBottom(element = document.body) {
        element.scrollTop = element.scrollHeight;
    }
    
}
