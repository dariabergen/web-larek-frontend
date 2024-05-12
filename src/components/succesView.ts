import { priceString } from '../utils/utils';
import { Component } from './base/component';
import { EventEmitter } from './base/events';

export interface ISuccess {
	total: number;
}

export class Success extends Component<ISuccess> {
	protected _button: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, events: EventEmitter) {
		super(container);
		this._description = container.querySelector(`.order-success__description`);
		this._button = container.querySelector(`.order-success__close`);
		this._button.addEventListener('click', () => events.emit('success:submit'));
	}

	set total(value: number) {
		this._description.textContent = 'Списано ' + priceString(value);
	}
}
