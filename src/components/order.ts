// Импорт необходимых модулей и типов данных
import {Form} from "./common/form";
import {IEvents} from "./base/events";
import {IOrderFormData} from "../types";


// Класс для управления заказом
export class Order extends Form<IOrderFormData> {
  // Защищенные свойства класса
  protected _buttonCard: HTMLElement;
  protected _buttonCash: HTMLElement;
  protected _button: HTMLElement;
  protected _payment: string;
  protected _address: HTMLInputElement;

  // Конструктор класса
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    // Инициализация элементов формы
    this._buttonCard = this.container.querySelector('.button_card');
    this._buttonCash = this.container.querySelector('.button_cash');
    this._button = this.container.querySelector('.order__button');
    this.toggleCard(true);
    this._address = this.container.elements.namedItem('address') as HTMLInputElement;
    this._payment = this._buttonCard.textContent;

    // Обработчики событий для кнопок выбора способа оплаты
    if (this._buttonCard) {
      this._buttonCard.addEventListener('click', () => {
        this.toggleCard(true);
        this.toggleCash(false);
        this._payment = this._buttonCard.textContent;
      });
    }

    if (this._buttonCash) {
      this._buttonCash.addEventListener('click', () => {
        this.toggleCard(false);
        this.toggleCash(true);
        this._payment = this._buttonCash.textContent;
      });
    }

    // Обработчик события клика по кнопке оформления заказа
    if (this._button) {
      this._button.addEventListener('click', () => {
        events.emit('contacts:open');
      });
    }
  }

  // Установка адреса доставки
  set address(value: string) {
    this._address.value = value;
  }

  // Получение выбранного способа оплаты
  get payment() {
    return this._payment;
  }

  // Метод для переключения состояния кнопки выбора оплаты "Картой"
  toggleCard(state: boolean = true) {
    this.toggleElementClass(this._buttonCard, 'button_alt-active', state);
  }

  // Метод для переключения состояния кнопки выбора оплаты "Наличными"
  toggleCash(state: boolean = true) {
    this.toggleElementClass(this._buttonCash, 'button_alt-active', state);
  }
}