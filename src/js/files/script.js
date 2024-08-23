// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

//пишем скрипт, отвечающий за открытие меню при нажатии на бургер 
document.addEventListener("DOMContentLoaded", function () {
	const menuIcon = document.querySelector('.menu__icon');
	const menuBody = document.querySelector('.menu__body');

	if (menuIcon) {
		menuIcon.addEventListener('click', function () {
			document.body.classList.toggle('_lock'); // Блокируем прокрутку страницы при открытом меню
			menuIcon.classList.toggle('_active');
			if (menuBody) {
				menuBody.classList.toggle('_active');
			}
		});
	}
});

//пишем скрипт, который обрабатывает клики по элементам, 
//которые имеют атрибут data-parent, и открывает соответствующие подменю.
//при открытии нового подменю, предыдущее закрывается

// каждый раз, когда пользователь кликает по странице, будет вызываться функция documentActions.
document.addEventListener("click", documentActions);

//скрипт, который будет автоматически проставлять класс с количеством категорий
//Этот код выбирает все элементы на странице, которые имеют класс .sub-menu-catalog__block, 
//и сохраняет их в переменную menuBlocks. 
const menuBlocks = document.querySelectorAll('.sub-menu-catalog__block');
// оператор проверяет, содержит ли menuBlocks хоть один элемент (т.е. menuBlocks.length больше 0)
if (menuBlocks.length) {
	//метод forEach проходит по каждому элементу в menuBlocks, и для каждого
	// элемента выполняется функция-обработчик, которая принимает текущий элемент menuBlock в качестве аргумента.
	menuBlocks.forEach(menuBlock => {
		//Внутри текущего элемента menuBlock этот код выбирает все элементы, которые имеют класс .sub-menu-catalog__category,
		// и подсчитывает их количество. Значение сохраняется в переменную menuBlockItems.
		const menuBlockItems = menuBlock.querySelectorAll('.sub-menu-catalog__category').length;
		//Этот код добавляет новый класс к текущему menuBlock. Класс формируется динамически, 
		//используя значение переменной menuBlockItems.
		menuBlock.classList.add(`sub-menu-catalog__block_${menuBlockItems}`);
	});
}

//Функция documentActions принимает объект события e,
//который содержит информацию о клике, включая элемент, на который кликнули.
function documentActions(e) {
	//e.target указывает на элемент, по которому был произведен клик.
	const targetElement = e.target;
	//Здесь проверяется, содержит ли кликнутый элемент или один из его предков атрибут data-parent
	//Если да, выполняется следующий блок кода.
	if (targetElement.closest('[data-parent]')) {
		//Получаем значение атрибута data-parent из кликнутого элемента. Затем ищем подменю с 
		//атрибутом data-submenu, значение которого равно subMenuId.
		const subMenuId = targetElement.dataset.parent ? targetElement.dataset.parent : null;
		const subMenu = document.querySelector(`[data-submenu="${subMenuId}"]`);
		//Получение элемента catalog-header
		const catalogMenu = document.querySelector('.catalog-header');
		//Проверка наличия подменю и переключение классов
		if (subMenu) {
			const activeLink = document.querySelector('._sub-menu-active');
			const activeBlock = document.querySelector('._sub-menu-open');
			//Если подменю существует (subMenu не равно null):

			if (activeLink && activeLink !== targetElement) {
				//Ищем текущий активный элемент (_sub-menu-active)
				// Если они существуют и отличаются от кликнутого элемента, удаляем у них эти классы. и открытое подменю (_sub-menu-open).
				// Это позволяет показать или скрыть подменю.
				activeLink.classList.remove('_sub-menu-active');
				activeBlock.classList.remove('_sub-menu-open');
			}
			targetElement.classList.toggle('_sub-menu-active');
			subMenu.classList.toggle('_sub-menu-open');
		} else {
			//Если подменю не найдено, выводится сообщение в консоль: "Ой ой, нет такого подменю :(".
			console.log('Ой ой, нет такого подменю :(');
		}
		//Это предотвращает выполнение стандартного действия браузера для клика, такого как переход по ссылке.
		e.preventDefault();
	}
}

