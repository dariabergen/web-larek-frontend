import {ensureAllElements, ensureElement} from '../utils/utils';
import {IEvents} from './base/events';
import {Form} from './common/form';
import {IContactForm, IOrderFormDatta} from '../types';

export class ContactForm extends Form<IContactForm> {
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;
    constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.emailInput = this.container.elements.namedItem('email') as HTMLInputElement;
		this.phoneInput = this.container.elements.namedItem('phone') as HTMLInputElement;

		this.emailInput.addEventListener('input', this.handleEmailChange.bind(this));
        this.phoneInput.addEventListener('input', this.handlePhoneChange.bind(this));
	}

    private handleEmailChange(event: Event) {
		const newEmail = (event.target as HTMLInputElement).value;
		this.emailInput.value = newEmail; 
	  }
	
	  private handlePhoneChange(event: Event) {
		const newPhone = (event.target as HTMLInputElement).value;
		this.phoneInput.value = newPhone; 
	  }

    get email(): string {
		return this.emailInput.value;
	}

	get phone(): string {
		return this.phoneInput.value;
	}
}

export class OrderForm extends Form<IOrderFormDatta> {
	protected buttonContainer: HTMLDivElement;
	protected onlineButton: HTMLButtonElement;
	protected cashButton: HTMLButtonElement;
	protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.buttonContainer = ensureElement<HTMLDivElement>('.order__buttons',container);
		[this.onlineButton, this.cashButton] = ensureAllElements<HTMLButtonElement>('.button_alt',container);
		this.addressInput = this.container.elements.namedItem('address') as HTMLInputElement;
		
	
        this.buttonContainer.addEventListener('click', (evt) => {
			if (evt.target === this.onlineButton || evt.target === this.cashButton) {
				const button = evt.target as HTMLButtonElement;
				this.resetButtons();
				this.toggleElementClass(button, 'button_alt-active', true);
				this.emitInput();
			}
		});
	}

	protected toggleCard(state = true) {
		this.toggleElementClass(this.onlineButton, 'button_alt-active', state);
	}

	protected toggleCash(state = true) {
		this.toggleElementClass(this.cashButton, 'button_alt-active', state);
	}

	protected resetButtons() {
		this.toggleCard(false);
		this.toggleCash(false);
	}

	protected getActiveButton(): HTMLButtonElement | null {
		if (this.onlineButton.classList.contains('button_alt-active')) {
			return this.onlineButton;
		} else if (this.cashButton.classList.contains('button_alt-active')) {
			return this.cashButton;
		} else {
			return null;
		}
	}

	clear(): void {
		super.clear();
		this.resetButtons();
	}

	get valid(): boolean {
		const isInputValid = super.valid;
		return isInputValid && this.payment !== '';
	}

	set valid(value: boolean) {
		super.valid = value;
	}

	get payment(): string {
		const buttonActive = this.getActiveButton();
		const result = buttonActive ? buttonActive.name : '';
		return result;
	}

	get address(): string {
		return this.addressInput.value;
	}
}



