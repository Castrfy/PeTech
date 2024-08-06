const container = document.getElementById('container');
const registerFormBtn = document.getElementById('registerform');
const loginFormBtn = document.getElementById('loginform');
const lightBtn = document.getElementById('light');
const darkBtn = document.getElementById('dark');

registerFormBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginFormBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

lightBtn.addEventListener('click', () => {
    lightBtn.style.zIndex = 0;
    darkBtn.style.zIndex = 1;
    container.classList.add("dark");
});

darkBtn.addEventListener('click', () => {
    darkBtn.style.zIndex = 0;
    lightBtn.style.zIndex = 1;
    container.classList.remove("dark");
});

