const container = document.querySelector('.container');
const form = document.querySelector('form');
const input = document.getElementById('inputTodo');
const ul = document.querySelector('ul');
const list__description = document.querySelector('.list__description');
const desktop__states = document.querySelector('.desktop__states');


form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    if (input.value !== '') listAddTodo(input.value);
});

const listAddTodo = value => {
    let li = document.createElement('li');
    let a = document.createElement('a');
    a.setAttribute('href', "#");

    let span = document.createElement('span');
    span.classList.add('check__icon');

    let i = document.createElement('i');
    let img = document.createElement('img');
    img.setAttribute('src', "app/images/icon-cross.svg");
    i.appendChild(img);

    a.innerText = value;
    li.appendChild(span);
    li.appendChild(a);
    li.appendChild(i);

    ul.appendChild(li);

    input.value = '';

    listTodo();
};

const listTodo = () => { 
    let listArrayTodo = Array.from(ul.children).map(node => node.innerText);
    let span = desktop__states.querySelector('span');
    let spanMobile = list__description.querySelector('span');

    span.innerText = `${listArrayTodo.length} items left`;
    spanMobile.innerText = `${listArrayTodo.length} items left`;
};


