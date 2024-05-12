import { IOrderForm } from '../types';
import { ACTIVE_BUTTON_CLASS } from '../utils/constants';
import { IEvents } from './base/events';
import { Form } from './common/form';

export class Order extends Form<IOrderForm> {
	protected buttons: HTMLButtonElement[] = [];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.buttons = [
			container.elements.namedItem('card') as HTMLButtonElement,
			container.elements.namedItem('cash') as HTMLButtonElement,
		];

		this.buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this.buttons.forEach((item) =>
					item.classList.remove(ACTIVE_BUTTON_CLASS)
				);
				button.classList.add(ACTIVE_BUTTON_CLASS);
				this.onInputChange('payment', button.name);
			});
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set payment(value: string) {
		const currentButton = this.buttons.find((button, index, array) => {
			return button.name === value;
		});
		if (currentButton) {
			currentButton.classList.add(ACTIVE_BUTTON_CLASS);
			this.onInputChange('payment', currentButton.name);
		}
	}

	cleanFieldValues() {
		this.address = '';
		this.payment = '';
		this.buttons.forEach((button) =>
			button.classList.remove(ACTIVE_BUTTON_CLASS)
		);
	}
}
