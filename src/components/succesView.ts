// Импорт необходимых модулей и типов данных
import {Component} from './base/component';
import {EventEmitter} from './base/events';
import {formatNumber} from '../utils/utils';
import {ISuccess} from '../types';

// Класс для отображения сообщения об успешном выполнении заказа
export class Success extends Component<ISuccess> {
    protected _close: HTMLElement; // Элемент для закрытия сообщения
    protected _total: HTMLElement; // Элемент с общей суммой заказа

    // Конструктор класса
    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);

        // Инициализация элементов сообщения
        this._close = this.container.querySelector('.order-success__close');
        this._total = this.container.querySelector('.order-success__description');

        // Обработка события клика по элементу закрытия
        if (this._close) {
            this._close.addEventListener('click', () => {
                events.emit('order:done');
            });
        }
    }

    // Установка текста элемента
    setText(element: HTMLElement, value: unknown) {
        super.setText(element, 'Списано ' + String(value) + ' синапсов');
    }

    // Установка общей суммы заказа
    set total(value: number) {
        this.setText(this._total, formatNumber(value));
    }
}