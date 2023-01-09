const selectFirstElement = () => {
	const firstElement = document.querySelectorAll('[data-nav-selectable]')[0];
	firstElement.setAttribute('data-nav-selected', 'true');
	firstElement.setAttribute('nav-index', '0');
};

const getAllElements = () => document.querySelectorAll('[data-nav-selectable]');

const getTheIndexOfTheSelectedElement = () => {
	const element = document.querySelector('[data-nav-selected=true]');
	return element ? parseInt(element.getAttribute('nav-index') ?? '0', 10) : 0;
};

const selectElement = (selectElement: Element) => {
	[].forEach.call(getAllElements(), (element: Element, index) => {
		const selectThisElement = element === selectElement;
		element.setAttribute('data-nav-selected', String(selectThisElement));
		element.setAttribute('nav-index', String(index));
	});
};

const Down = () => {
	const allElements = getAllElements();
	const currentIndex = getTheIndexOfTheSelectedElement();
	const goToFirstElement = currentIndex + 1 > allElements.length - 1;
	const setIndex = goToFirstElement ? 0 : currentIndex + 1;
	selectElement(allElements[setIndex] || allElements[0]);

	if (goToFirstElement) {
		// Scroll to top
		window.scrollTo(0, 0);
	} else {
		// Scroll to center of the element
		allElements[setIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
	}
};

const Up = () => {
	const allElements = getAllElements();
	const currentIndex = getTheIndexOfTheSelectedElement();
	const goToLastElement = currentIndex === 0;
	const setIndex = goToLastElement ? allElements.length - 1 : currentIndex - 1;
	selectElement(allElements[setIndex] || allElements[0]);

	if (goToLastElement) {
		// Scroll to bottom
		window.scrollTo(0, document.body.scrollHeight);
	} else {
		// Scroll to center of the element
		allElements[setIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
	}
};

const getSelectedElement = () => document.querySelector('[data-nav-selected=true]');

export default { Down, Up, selectElement, selectFirstElement, getSelectedElement };
