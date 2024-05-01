// Импорт необходимых модулей и типов данных
import {Component} from "./base/component";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";
import {IPageState} from "../types";

// Класс для управления страницей
export class Page extends Component<IPageState> {
    protected _counter: HTMLElement; // Элемент счетчика товаров в корзине
    protected _gallery: HTMLElement; // Элемент галереи товаров
    protected _wrapper: HTMLElement; // Обертка страницы
    protected _basket: HTMLElement; // Элемент корзины

    // Конструктор класса
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        // Инициализация элементов страницы
        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._gallery = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

        // Обработка события клика по элементу корзины
        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    // Установка значения счетчика товаров в корзине
    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    // Установка элементов галереи товаров
    set gallery(items: HTMLElement[]) {
        this._gallery.replaceChildren(...items);
    }

    // Установка состояния блокировки страницы
    set locked(value: boolean) {
        this.toggleElementClass(this._wrapper, 'page__wrapper_locked', value);   
    }
}