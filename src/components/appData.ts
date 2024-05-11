import { Model } from './base/model';
import { IAppData, IProduct, IOrder, IOrderForm, TFormErrors } from '../types';

export class AppState extends Model<IAppData> {
	cardList: IProduct[];
	basket: IProduct[] = [];
	order: IOrder = {
		address: '',
		payment: '',
		email: '',
		total: 0,
		phone: '',
		items: [],
	};
	preview: string | null;
	formErrors: TFormErrors = {};

	setCatalog(items: IProduct[]) {
		this.cardList = items;
		this.emitChanges('items:changed', this.cardList);
	}

	get statusBasket(): boolean {
		return this.basket.length === 0;
	}

	getTotal() {
		return this.basket.reduce(function (accum, item) {
			return accum + item.price;
		}, 0);
	}

	get basketList(): IProduct[] {
		return this.basket;
	}

	setPreview(item: IProduct) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	addCardToBasket(item: IProduct) {
		this.order.items.push(item.id);
	}

	setCardToBasket(item: IProduct) {
		this.basket.push(item);
	}

	deleteCardToBasket(item: IProduct) {
		const index = this.basket.indexOf(item);
		if (index >= 0) {
			this.basket.splice(index, 1);
		}
	}

	clearBasket() {
		this.basket = [];
		this.order.items = [];
	}

	setContactsField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		} else if (!this.order.payment) errors.payment = 'Выберите способ оплаты';
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};
		const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
		const phoneRegex = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;

		if (this.order.phone.startsWith('8'))
			this.order.phone = '+7' + this.order.phone.slice(1);
		// console.log(this.order.phone.slice(1));
		if (!this.order.email) errors.email = 'Необходимо указать email';
		else if (!emailRegex.test(this.order.email))
			errors.email = 'Некорректный адрес электронной почты';
		if (!this.order.phone) errors.phone = 'Необходимо указать телефон';
		else if (!phoneRegex.test(this.order.phone))
			errors.phone = 'Некорректный формат номера телефона';
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clearOrder() {
		this.order = {
			email: '',
			phone: '',
			payment: 'cash',
			address: '',
			items: [],
			total: 0,
		};
	}
}
