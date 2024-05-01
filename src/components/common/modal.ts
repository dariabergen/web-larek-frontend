import {Component} from "../base/component";
import {ensureElement} from "../../utils/utils";
import {IEvents} from "../base/events";
import {IModalData} from "../../types";

// Класс для создания модального окна
export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement; // Кнопка закрытия модального окна
    protected _content: HTMLElement; // Контент модального окна

    // Конструктор класса Modal
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        // Находим элементы кнопки закрытия и контента модального окна
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        // Устанавливаем обработчики событий на кнопку закрытия, само модальное окно и контент
        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    // Метод для установки контента модального окна
    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    // Метод для открытия модального окна
    open() {
        this.toggleElementClass(this.container, 'modal_active', true);
        this.events.emit('modal:open');
    }

    // Метод для закрытия модального окна
    close() {
        // Удаляем класс 'modal_active' для скрытия модального окна
        this.toggleElementClass(this.container, 'modal_active', false);
        this.content = null;
        this.events.emit('modal:close');
    }

    // Метод для рендеринга модального окна с данными
    render(data: IModalData): HTMLElement {
        super.render(data); 
        this.open(); 
        return this.container; 
    }
}