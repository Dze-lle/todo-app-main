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
    const li = document.createElement('li');
    li.innerHTML = `<span class="check__icon"></span>
                    <a href="#">${value}</a>
                    <i>
                        <img src="app/images/icon-cross.svg" alt="icon-cross">
                    </i>`;
    ul.append(li);    
    
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


