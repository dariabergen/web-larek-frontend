import { IBasket } from '../types';
import { createElement, ensureElement } from '../utils/utils';
import { Component } from './base/component';
import { IEvents } from './base/events';
export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	button: HTMLButtonElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this.button = ensureElement<HTMLButtonElement>('.basket__button',this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		if (this.button)
			this.button.addEventListener('click', () => events.emit('order:open'));

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.button.disabled = false;
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(val: number) {
		this.setText(this._total, `${val.toString()} синапсов`);
	}

	getTotal() {
		return this._total.textContent;
	}
}
