import { Component } from './base/component';
import { CardCategoryEnum, IProduct, IProductBasket, IPreviewCard } from '../types';
import { ensureElement } from '../utils/utils';
import { IActions } from '../types';

export class Card<T> extends Component<IProduct> {
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, actions?: IActions) {
		super(container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);

		if (actions?.onClick) container.addEventListener('click', actions.onClick);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.className = `card__category card__category_${
			CardCategoryEnum[value as keyof typeof CardCategoryEnum]
		}`;
	}

	set price(value: number | null) {
		this.setText(
			this._price,
			value ? `${value.toString()} синапсов` : 'Бесценно'
		);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}
}

export class CardBasket extends Component<IProductBasket> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _button: HTMLElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, actions?: IActions) {
		super(container);
		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._button = ensureElement<HTMLElement>(`.card__button`, container);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);

		if (actions?.onClick) {
			if (this._button) {
				container.removeEventListener('click', actions.onClick);
				this._button.addEventListener('click', actions.onClick);
			}
		}
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number | null) {
		this.setText(
			this._price,
			value ? `${value.toString()} синапсов` : 'Бесценно'
		);
	}
}

export class PreviewCard extends Card<IPreviewCard> {
	protected _description: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, actions?: IActions) {
		super(container, actions);
		this._button = ensureElement<HTMLElement>(`.card__button`, container);
		this._description = ensureElement<HTMLElement>(`.card__text`, container);

		if (actions?.onClick) {
			if (this._button) {
				container.removeEventListener('click', actions.onClick);
				this._button.addEventListener('click', actions.onClick);
			}
		}
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set price(value: number | null) {
		if (value) {
			this.setText(this._price, value + ` синапсов`);
		} else {
			this._button.setAttribute('disabled', 'true');
			this.setText(this._price, `Бесценно`);
		}
	}
}
