
const input = document.querySelector('.input__search');
const inputData = document.querySelector('.input__data');
const searchNow = document.querySelectorAll('.input__option');
const btnClose = document.querySelector('.result__closse');
const fixElement = document.querySelectorAll('.result__elem')
let inputFix = document.querySelector('.input__fix');
let option = document.querySelector('.input__option');

let map = new Map();
let search = '';


//задержка времени на выполнение, после события
const debounce = (fn, debounceTime) => {
	let timeout;
  return function () {	
		const fnCall = () => {fn.apply(this, arguments)}
		clearTimeout(timeout);
		timeout = setTimeout(fnCall, debounceTime);
	}
};

//получение данных с сервера
async function getRepositoresOnGitHub(search) {
	const url = `https://api.github.com/search/repositories?q=${search}`;

	try {
		const response = await fetch(url);
		return response.json();
	} catch (err) {
		console.error(err);
	}
}

//создание 5 всплывающих элементов на странице
async function addList() {
	search = input.value;
	const repositories = await getRepositoresOnGitHub(search);

	if (option) {
		removeList()
	}
	
	let fragment = new DocumentFragment();

	for (let i = 0; i < 5; i++) {		

		option = document.createElement('div');
		option.classList.add('input__option');	
		await option.append(repositories.items[i]['name']);
		option.id = repositories.items[i]['id']
		await map.set(option.id, repositories.items[i])
		fragment.append(option)
	}	
	inputData.append(fragment)
}

//удаление всплывающих элементов
function removeList() {
	const delEl = document.querySelectorAll('.input__option')
	delEl.forEach((el) => el.remove());
}

function removeElement() {
	const elem = document.querySelectorAll('.input__fix')
	elem.remove()
}

//добавлениие выбранных элементов в отдельный список
function createAddedElement(target) {
	let fragment = new DocumentFragment();

	let fixElem = document.createElement('div');
	fixElem.classList.add('result__elem')
	let leftSide = document.createElement('div')
	leftSide.classList.add('result__main')
	
	let resName = document.createElement('div')
	resName.classList.add('result__name')
	resName.textContent = `Name: ${map.get(target).name}`
	leftSide.append(resName)

	let resOwner = document.createElement('div')
	resOwner.classList.add('result__owner')
	resOwner.textContent = `Owner: ${map.get(target).owner.login}`
	leftSide.append(resOwner)

	let resStars = document.createElement('div')
	resStars.classList.add('result__stars')
	resStars.textContent = `Stars: ${map.get(target).stargazers_count}`
	leftSide.append(resStars)
	

	let btnClose = document.createElement('button')
	btnClose.classList.add('result__closse')

	fixElem.append(leftSide);
	fixElem.append(btnClose);
	fragment.append(fixElem);

	inputFix.append(fragment);

	
	btnClose.addEventListener('click', () => {
		fixElem.remove()
	})
}

//ожидание ввода пользователем запроса
input.addEventListener('keyup', debounce(addList, 500));

//ожидание выбора пользователем элемента из всплывающего списка
inputData.addEventListener('click', (ev) => {
	let target = ev.target;
	target.classList.add('input__option--active')


	createAddedElement(target.id);

	setTimeout(() => {
		input.value = '';
	}, 200)
})
	
