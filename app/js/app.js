const container = document.querySelector('.container');
const form = document.querySelector('form');
const input = document.getElementById('inputTodo');
const ul = document.querySelector('ul');
const list__description = document.querySelector('.list__description');
const desktop__states = document.querySelector('.desktop__states');
const check__icon = document.querySelector('span.check__icon');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    let icon = event.target.children[0].children[0];
    let iconBoolean = false;
    icon.classList.contains('checked') ? iconBoolean = true : iconBoolean = false;
    if (input.value !== '') listAddTodo(input.value, iconBoolean);
});

const listAddTodo = (value, iconBoolean) => {
    const li = document.createElement('li');

    li.innerHTML = `<span class="check__icon ${iconBoolean ? 'checked' : ''}">
                        <img style="${iconBoolean ? 'visibility: visible' : 'visibility: hidden'}" src="app/images/icon-check.svg" alt="">
                    </span>
                    <a href="#">${iconBoolean ? `<s style="color: hsl(233, 14%, 35%); font-weight: normal">${value}</s>`: value}</a>
                    <i>
                        <img src="app/images/icon-cross.svg" alt="icon-cross">
                    </i>`;
    ul.append(li);    
    
    input.value = '';

    li.querySelector('span.check__icon').addEventListener('click', (event) => {
        if (!li.querySelector('span.check__icon').classList.contains('checked')) {
            li.querySelector('span.check__icon').classList.add('checked');
            li.querySelector('span.check__icon').children[0].style.visibility = 'visible';
        } else {
            li.querySelector('span.check__icon').classList.remove('checked');
            li.querySelector('span.check__icon').children[0].style.visibility = 'hidden';
        }
    });

    listTodo();
};

const listTodo = () => { 
    let listArrayTodo = Array.from(ul.children).map(node => node.innerText);
    let span = desktop__states.querySelector('span');
    let spanMobile = list__description.querySelector('span');

    span.innerText = `${listArrayTodo.length} items left`;
    spanMobile.innerText = `${listArrayTodo.length} items left`;
};

check__icon.addEventListener('click', (event) => {
    if (!check__icon.classList.contains('checked')) {
        check__icon.classList.add('checked');
        check__icon.children[0].style.visibility = 'visible';
    } else {
        check__icon.classList.remove('checked');
        check__icon.children[0].style.visibility = 'hidden';
    }
});


