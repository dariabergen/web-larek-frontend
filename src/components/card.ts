import { ICard } from '../types';
import { settings } from '../utils/constants';
import { ensureElement, priceString } from '../utils/utils';
import { Component } from './base/component';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _category?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _description?: HTMLElement;
	protected _index?: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);
		this._image = container.querySelector(`.card__image`);
		this._category = container.querySelector(`.card__category`);
		this._button = container.querySelector('.card__button');
		this._description = container.querySelector('.card__text');
		this._index = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}
	private getCategoryClass(value: string) {
		const categorySetting = settings[value] || 'unknown';
		return 'card__category_' + categorySetting;
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	set price(value: number | null) {
		this._price.textContent = priceString(value);
		if (!value) {
			this.setDisabled(this._button, true);
		}
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		this._category.textContent = value;
		const backgroundColorClass = this.getCategoryClass(value);
		this._category.classList.add(backgroundColorClass);
	}

	set description(value: string) {
		this._description.textContent = value;
	}

	set inBasket(isInBasket: boolean) {
		this._button.textContent = isInBasket ? 'Убрать' : 'В корзину';
	}

	set index(value: number) {
		this._index.textContent = String(value);
	}
}
