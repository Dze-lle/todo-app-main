const container = document.querySelector('.container');
const todo = document.getElementById('inputTodo');
const list = document.querySelector('ul');
const form = document.querySelector('form');
const checkIcon = document.querySelector('span.check__icon');
const clearCompleted = document.querySelector('.desktop__states > a');
const filterStates = document.querySelectorAll('.states__list > a');
const icon = document.querySelector('.icon');
const ul = document.querySelector('ul');

checkIcon.addEventListener('click', toggleCheck);

clearCompleted.addEventListener('click', deleteTodoCompleted);

icon.addEventListener('click', changeTheme);

form.addEventListener('submit', addTodo);

window.addEventListener('DOMContentLoaded', function() {
    setUpTodos();
    loadTheme();
    loadState();
});

function setUpTodos() {
    let todosItems = getLocalStorage();
    if (todosItems.length > 0) {
        displayTodos(todosItems);
    };
};

function toggleCheck() {
   checkIcon.classList.toggle('checked');
};

function changeTheme() {
    if (!container.classList.contains('light-theme')) {
		document.querySelector('.icon > img').src = 'app/images/icon-moon.svg';
		container.classList.add('light-theme');
	} else {
		document.querySelector('.icon > img').src = 'app/images/icon-sun.svg';
		container.classList.remove('light-theme');
	}

    const iterator = container.classList.values();
    const iconTheme = icon.children[0].attributes[0].value;

    for(let pageTheme of iterator) {
        localStorage.setItem('theme', JSON.stringify([{ pageTheme, iconTheme }]));
    }
};

function loadTheme() {
    const themes = JSON.parse(localStorage.getItem('theme'));

    if (themes === null) return;

    if (themes.length > 0) {
        themes.map(items => {
            document.querySelector('.icon > img').src = items.iconTheme;
            container.classList.add(items.pageTheme);
        });
    }
};

function displayTodos(todos) {
    const stringHtml = todos.map(todo => {
        return `<li data-id="${todo.id}" draggable="true">
                    <span class="check__icon ${todo.state ? 'checked' : ''}">
                    <img style="visibility: hidden" 
                    src="app/images/icon-check.svg" alt="icon-check">
                    </span>
                    <a href="#" ${todo.state ? 'style="color: hsl(233, 14%, 35%); font-weight: normal; text-decoration: line-through;"': ''}>
                        ${todo.value}
                    </a>
                    <i>
                        <img src="app/images/icon-cross.svg" alt="icon-cross">
                    </i>
                </li>`;
    }).join('');

    list.innerHTML = stringHtml;

    const deleteElement = list.querySelectorAll('li i');
    deleteElement.forEach(element => {
        element.addEventListener('click', deleteTodo);
    });

    const spanChecked = list.querySelectorAll('li .check__icon');
    spanChecked.forEach(span => {
        span.addEventListener('click', changeCheckedElement)
    });
    ItemsLeft();

    DraggableProccess();
}


// CRUD
function addTodo(e) {
    e.preventDefault();
    let value = todo.value;

    if (value !== '') {
        let id = new Date().getTime().toString();
        let stateBoolean = e.currentTarget.children[0].children[0].classList.contains('checked');
        addTodoToLocalStorage(id, value, stateBoolean);
        setResetInput();

        filterStates.forEach(item => {
            if (item.textContent !== 'All') {
                if (item.classList.contains('active')) {
                    item.classList.remove('active');
                }
            } else {
                if (!item.classList.contains('active')) {
                    item.classList.add('active');
                }
            }
        });
    }
};


function deleteTodo(e) {
    let element = e.currentTarget.parentElement;
    let id = element.dataset.id;

    list.removeChild(element);
    removeTodoToLocalStorage(id);
    ItemsLeft();
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

    localStorage.setItem('todos', JSON.stringify(todosItems));

    displayTodos(todosItems);
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

filterStates.forEach(filterState => {
    filterState.addEventListener('click', () => {
        filterStates.forEach(item => {
            if (item !== filterState) {
                item.classList.remove('active');
            }
        });
        filterState.classList.toggle('active');


        switch (filterState.textContent.trim()) {
			case 'Completed':
				FilterCompleted();
				break;
			case 'Active':
				FilterActive();
				break;
			default:
                FilterAll();
        }

        localStorage.setItem('previousState', filterState.textContent.trim());
    });
});

function loadState() {
    const state = localStorage.getItem('previousState');

    if (state == null) return;

    if (state.length > 0) {
        filterStates.forEach(item => {
            item.textContent.trim() === state.trim()
            ? item.classList.toggle('active')
            : item.classList.remove('active')
        });
    
        if (state === 'Completed') {
            FilterCompleted();
        } else if (state === 'Active') {
            FilterActive();
        } else {
            FilterAll();
        }
    }
}

function FilterCompleted() {
    let todosItems = getLocalStorage();
    todosItems = todosItems.filter(todo => !!todo.state);
    displayTodos(todosItems);
}

function FilterActive() {
    let todosItems = getLocalStorage();
    todosItems = todosItems.filter(todo => !todo.state);
    displayTodos(todosItems);
}

function FilterAll() {
    let todosItems = getLocalStorage();
    
    if (todosItems.length > 0) {
        displayTodos(todosItems);
    };
};

// logic draggable 
const DraggableProccess = () => {
    const lis = document.querySelectorAll('li');


    lis.forEach(li => {
        li.addEventListener('dragstart', () => {
            li.classList.add('dragging');
        });

        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
            let todosItems = getLocalStorage();

            Array.from(document.querySelectorAll('li')).map((item, idx) => {
                let id = item.getAttribute('data-id');
                todosItems.map((todo, idxTodo) => {
                    if (todo.id === id) {
                        todosItems.splice(idx, 0, todosItems.splice(idxTodo, 1)[0]);
                    }
                });
            });
            
            localStorage.setItem('todos', JSON.stringify(todosItems));
        });
    });

    ul.addEventListener('dragover', event => {
        event.preventDefault();
        const afterElment = getDragAfterElement(ul, event.clientY);
        const draggable = document.querySelector('.dragging');

        if (afterElment == null) {
            ul.appendChild(draggable);
        } else {
            ul.insertBefore(draggable, afterElment);
        }
    });

    const getDragAfterElement = (ul, y) => {
        const draggableElement = [...ul.querySelectorAll('li:not(.dragging)')];
        return draggableElement.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            { offset: Number.NEGATIVE_INFINITY },
        ).element;
    };
};

