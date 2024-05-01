import {IEvents} from './base/events';
import {Form} from './common/form';
import {IContactForm} from '../types';
export class ContactForm extends Form<IContactForm> {
	protected _button: HTMLElement;
	protected _phone: HTMLInputElement;
	protected _email: HTMLInputElement;
	// Конструктор класса
	constructor(container: HTMLFormElement, events: IEvents) {
		// Вызов конструктора родительского класса
		super(container, events);

		// Инициализация элементов формы
		this._button = this.container.querySelector('.button');
		this._phone = this.container.elements.namedItem('phone') as HTMLInputElement;
		this._email = this.container.elements.namedItem('email') as HTMLInputElement;

		// Обработчик события клика по кнопке отправки формы
		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('success:open');
			});
		}
	}

    set phone(value: string) {
		this._phone.value = value;
	}

	set email(value: string) {
		this._email.value = value;
	}
}
