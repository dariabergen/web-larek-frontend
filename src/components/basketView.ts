import {IEvents} from './base/events';
import {ensureElement} from '../utils/utils';
import {Component} from './base/component';

interface IBasketView {
	price: number;
    list: HTMLElement[];
	valid: boolean;
}

export class BasketView extends Component<IBasketView> {
    protected events: IEvents;
    protected button: HTMLButtonElement;
	protected _list: HTMLElement;
	protected _price: HTMLSpanElement;
	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._list = ensureElement<HTMLUListElement>('.basket__list', container);
		this.button = ensureElement<HTMLButtonElement>('.basket__button',container);
		this._price = ensureElement<HTMLSpanElement>('.basket__price', container);
		this.button.addEventListener('click', () => this.events.emit('order:open'));
        this.events = events;
	}

    set price(value: number) {
		this.setText(this._price, `${value} синапсов`);
	}

	set list(items: HTMLElement[]) {
		this._list.replaceChildren(...items);
	}

	set valid(state: boolean) {
		this.setDisabled(this.button, state);
	}
}
