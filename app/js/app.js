const container = document.querySelector('.container');
const form = document.querySelector('form');
const input = document.getElementById('inputTodo');
const ul = document.querySelector('ul');
const list__description = document.querySelector('.list__description');
const desktop__states = document.querySelector('.desktop__states');
const check__icon = document.querySelector('span.check__icon');
const states__list = document.querySelector('.states__list');

let ListTodo = [];

check__icon.addEventListener('click', event => {
	if (!check__icon.classList.contains('checked')) {
		check__icon.classList.add('checked');
	} else {
		check__icon.classList.remove('checked');
	}
});

form.addEventListener('submit', event => {
	if (input.value === '') return;

	// create an array of objects with the inputs
	ListTodo = SetTodoObj(event);
	// display the list
	DisplayTodo(ListTodo);
	event.preventDefault();
});

ul.addEventListener('click', event => {
	let CheckTodoList = ListTodo.map(obj => {
		if (obj.id == event.target.dataset.id) {
			if (!event.target.classList.contains('checked')) {
				event.target.classList.add('checked');
				obj.completed = true;
			} else {
				event.target.classList.remove('checked');
				obj.completed = false;
			}
			obj;
		}
		return obj;
	});

	DisplayTodo(CheckTodoList);
});

const SetTodoObj = event => {
	let eventChecked = event.target.children[0].children[0];
	let completed;
	eventChecked.classList.contains('checked') ? (completed = true) : (completed = false);

	let id = ListTodo.length;

	ListTodo.push({ completed: completed, id: id, text: input.value });
	input.value = '';

	return ListTodo;
};

const DisplayTodo = ListTodo => {
	const li = ListTodo.map(todo => {
		return `
		<li>
			<span data-id="${todo.id}" class="check__icon ${todo.completed ? 'checked' : ''}">
				<img style="visibility: hidden" 
				src="app/images/icon-check.svg" alt="icon-check">
			</span>
			<a href="#">
			${
				todo.completed
					? `<s style="color: hsl(233, 14%, 35%); font-weight: normal">${todo.text}</s>`
					: todo.text
			}
			</a>
			<i>
				<img data-id="${todo.id}" src="app/images/icon-cross.svg" alt="icon-cross">
			</i>
		</li>`;
	}).join('');

	document.getElementById('listTodo').innerHTML = li;
	ItemsLength();
};

const ItemsLength = string => {
	let span = desktop__states.querySelector('span');
	let spanMobile = list__description.querySelector('span');

	if (string === 'Completed') {
		let ItemCompleted = ListTodo.filter(item => item.completed);
		span.innerText = `${ItemCompleted.length} items completed`;
		spanMobile.innerText = `${ItemCompleted.length} items completed`;
	} else {
		let ItemsLeft = ListTodo.filter(item => !item.completed);
		span.innerText = `${ItemsLeft.length} items left`;
		spanMobile.innerText = `${ItemsLeft.length} items left`;
	}
};

states__list.addEventListener('click', event => {
	switch (event.target.innerText) {
		case 'Completed':
			FilterCompleted();
			ItemsLength('Completed');
			break;
		case 'Active':
			FilterActive();
			break;
		default:
			DisplayTodo(ListTodo);
	}
});

const FilterCompleted = () => {
	let FilterCompleted = ListTodo.filter(item => item.completed);
	DisplayTodo(FilterCompleted);
};

const FilterActive = () => {
	let FilterActive = ListTodo.filter(item => !item.completed);
	DisplayTodo(FilterActive);
};
