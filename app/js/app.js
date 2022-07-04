const container = document.querySelector('.container');
const todo = document.getElementById('inputTodo');
const list = document.querySelector('ul');
const form = document.querySelector('form');
const checkIcon = document.querySelector('span.check__icon');
const clearCompleted = document.querySelector('.desktop__states > a');

checkIcon.addEventListener('click', toggleCheck);

form.addEventListener('submit', addTodo);

clearCompleted.addEventListener('click', deleteTodoCompleted);

window.addEventListener('DOMContentLoaded', setTodos);

function toggleCheck() {
   checkIcon.classList.toggle('checked');
};

// CRUD
function addTodo(e) {
    e.preventDefault();
    let value = todo.value;

    if (value !== '') {
        let id = new Date().getTime().toString();
        let stateCheck = e.currentTarget.children[0].children[0].classList.contains('checked');

        let li = document.createElement('li');
        li.setAttribute('data-id', id);
        li.setAttribute('draggable', true);
        
        const stringHtml = `<span class="check__icon ${stateCheck ? 'checked' : ''}">
                    <img style="visibility: hidden" 
                    src="app/images/icon-check.svg" alt="icon-check">
                    </span>
                    <a href="#" ${stateCheck ? 'style="color: hsl(233, 14%, 35%); font-weight: normal; text-decoration: line-through;"': ''}>
                        ${value}
                    </a>
                    <i>
                        <img src="app/images/icon-cross.svg" alt="icon-cross">
                    </i>`;

        li.innerHTML = stringHtml;

        const deleteElement = li.querySelector('i');
        deleteElement.addEventListener('click', deleteTodo);

        const spanChecked = li.querySelector('.check__icon');
        spanChecked.addEventListener('click', changeCheckedElement)


        list.appendChild(li);
        addTodoToLocalStorage(id, value, stateCheck);
        setResetInput();
        ItemsLeft();
    }
};

function deleteTodo(e) {
    let element = e.currentTarget.parentElement;
    let id = element.dataset.id;

    list.removeChild(element);
    removeTodoToLocalStorage(id);
};

function deleteTodoCompleted() {
    const todos = document.querySelectorAll('li');

    if (todos.length > 0) {
        todos.forEach(todo => {
            if (todo.children[0].classList.contains('checked')) {
                list.removeChild(todo);
            } else {
                // alert('no existen valores completados');
            }
        });
    }
    // alert('no existen valores completados');

    let todosItems = getLocalStorage();
    todosItems = todosItems.filter(todo => !todo.state);

    localStorage.setItem('todos', JSON.stringify(todosItems));
    ItemsLeft();
};

function changeCheckedElement(e) {
    e.currentTarget.classList.toggle('checked');
    let id = e.currentTarget.parentElement.dataset.id;
    let currentState = e.currentTarget.classList.contains('checked');

    if (currentState) {
        e.currentTarget.nextSibling.nextSibling.style.cssText = 
            `color: hsl(233, 14%, 35%); 
            font-weight: normal; 
            text-decoration: line-through;`;
    } else {
        e.currentTarget.nextSibling.nextSibling.style.cssText = `font-weight: normal;`;
    }
    updateStateToLocalStorage(id, currentState);
    ItemsLeft();
};

// local Storage
function getLocalStorage() {
    return localStorage.getItem('todos') 
        ? JSON.parse(localStorage.getItem('todos'))
        : [];
};

function addTodoToLocalStorage(id, value, state) {
    const objTodo = { id, value, state };
    let todosItems = getLocalStorage();
    todosItems.push(objTodo);

    localStorage.setItem('todos', JSON.stringify(todosItems))
};

function updateStateToLocalStorage(id, currentState) {
    let todosItems = getLocalStorage();

    todosItems = todosItems.map(todo => {
        if (todo.id === id) {
            todo.state = currentState;
        }
        return todo;
    });
    localStorage.setItem('todos', JSON.stringify(todosItems));
};

function removeTodoToLocalStorage(id) {
    let todosItems = getLocalStorage();

    todosItems = todosItems.filter(todo => {
        if (todo.id !== id) {
            return todo;
        }
    });
    localStorage.setItem('todos', JSON.stringify(todosItems));
};

function setResetInput() {
    todo.value = '';
    if (checkIcon.classList.contains('checked')) {
        checkIcon.classList.remove('checked');
    }
};

function ItemsLeft() {
    let todosItems = getLocalStorage();
    const span = document.querySelector('.desktop__states > span');
    if (todosItems.length > 0) {
        span.innerHTML = `${todosItems.filter(todo => !todo.state).length} items left`;
    } else {
        span.innerHTML = `0 items left`;
    }
};

// DOM 
function setTodos() {
    let todosItems = getLocalStorage();

    if (todosItems.length > 0) {
        todosItems.forEach(todo => {
            loadedContent(todo.id, todo.value, todo.state);
        });
    };
};

function loadedContent(id, value, state) {
    let li = document.createElement('li');
    li.setAttribute('data-id', id);
    li.setAttribute('draggable', true);

    const stringHtml = `<span class="check__icon ${state ? 'checked' : ''}">
                <img style="visibility: hidden" 
                src="app/images/icon-check.svg" alt="icon-check">
                </span>
                <a href="#" ${state ? 'style="color: hsl(233, 14%, 35%); font-weight: normal; text-decoration: line-through;"': ''}>
                    ${value}
                </a>
                <i>
                    <img src="app/images/icon-cross.svg" alt="icon-cross">
                </i>`;

    li.innerHTML = stringHtml;

    const deleteElement = li.querySelector('i');
    deleteElement.addEventListener('click', deleteTodo);

    const spanChecked = li.querySelector('.check__icon');
    spanChecked.addEventListener('click', changeCheckedElement)

    list.appendChild(li);
    ItemsLeft();
};




