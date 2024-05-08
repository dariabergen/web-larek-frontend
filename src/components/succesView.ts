import { ensureElement } from '../utils/utils';
import { Component } from './base/component';
import { IEvents } from './base/events';

interface ISuccess {
	total: number;
}
export class Success extends Component<ISuccess> {
	protected button: HTMLButtonElement;
	protected events: IEvents;
	protected description: HTMLParagraphElement;
	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.button = ensureElement<HTMLButtonElement>('.button', container);
		this.description = ensureElement<HTMLParagraphElement>('.order-success__description',container);
		this.button.addEventListener('click', () => this.events.emit('success:submit'));
        this.events = events;
	}

	set total(value: number) {
		const text = `Списано ${value} синапсов`;
		this.setText(this.description, text);
	}
}
