// Импорт необходимых модулей и типов данных
import {Component} from './base/component';
import {createElement, ensureElement, formatNumber} from '../utils/utils';
import {EventEmitter} from './base/events';
import {IBasketView} from '../types';

// Определение класса для представления корзины товаров
export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement; // Список товаров в корзине
	protected _total: HTMLElement; // Общая стоимость товаров в корзине
	protected _button: HTMLButtonElement; // Кнопка открытия заказа
	protected _index: HTMLElement; // Индикатор количества товаров в корзине

	// Конструктор класса
	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		// Инициализация элементов корзины
		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		// Обработка события нажатия на кнопку заказа
		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open'); // Отправка события открытия заказа
			});
			this.setDisabled(this._button, true); // Установка кнопки в неактивное состояние
		}

		this.items = []; // Инициализация списка товаров в корзине
	}

	// Установка списка товаров в корзине
	set items(items: HTMLElement[]) {
		// Если есть товары в корзине, заменить список, иначе отобразить сообщение о пустой корзине
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	// Переопределение метода установки текста с добавлением слова "синапсов"
	setText(element: HTMLElement, value: unknown) {
		super.setText(element, String(value) + ' синапсов');
	}

	// Установка общей стоимости товаров в корзине
	set total(total: number) {
		this.setText(this._total, formatNumber(total)); // Форматирование и установка текста
	}

	// Получение общей стоимости товаров в корзине
	get total() {
		return Number(this._total.textContent.split(' ').slice(0, -1).join('')); // Получение числового значения
	}

	// Получение кнопки заказа
	get button() {
		return this._button;
	}
}