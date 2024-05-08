import { ensureElement } from '../utils/utils';
import { Component } from './base/component';
import { IEvents } from './base/events';

interface IPageState {
	catalog: HTMLElement[];
	counter: number;
}

export class Page extends Component<IPageState> {
    protected _counter: HTMLSpanElement;
	protected _basketButton: HTMLElement;
	protected _catalog: HTMLElement;
    protected _wrapper: HTMLDivElement;
	protected events: IEvents;
    constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this._basketButton = ensureElement<HTMLElement>('.header__basket');
		this._counter = ensureElement<HTMLSpanElement>('.header__basket-counter');
		this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLDivElement>('.page__wrapper', container);
        this._basketButton.addEventListener('click', () => events.emit('basket:open'));
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set counter(value: string) {
		this.setText(this._counter, value);
	}

  lockScroll(state: boolean) {
    this.toggleElementClass(this._wrapper, 'page__wrapper_locked', state);
  }
}

