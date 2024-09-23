import { Effects } from '../styles/effects.js';
import socket from '../index.js';

class Page {

    constructor() {
        this.#init();
    }

    #init() {


        this.signupForm = document.getElementById('signupForm');
        this.passwordField = document.getElementById('password');
        this.confirmPassword = document.getElementById('confirmPassword');
        this.errorContainer = document.getElementById('error');


        this.#run();
    }

    async #run() {

        await this.signup();
    }

    async signup() {
        this.signupForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const password = this.passwordField.value;
            const confirmPassword = this.confirmPassword.value;

            if (password !== confirmPassword) {
                error.textContent = "As senhas não coincidem!";
            } else {
                error.textContent = "";
                alert('Cadastro realizado com sucesso!');
            }
        });

    }
}


document.addEventListener('DOMContentLoaded', () => {
    new Page();
});