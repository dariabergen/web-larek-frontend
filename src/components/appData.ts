import {Model} from './base/model';
import {mailRegex, phoneRegex} from '../utils/constants';
import {IEvents} from './base/events';
import {FormErrors,IAppState,IProduct,IOrder,IContactForm,IOrderFormData,} from '../types';

// Определение класса для представления отдельного товара
export class LotItem extends Model<IProduct> {
	about: string;
	description: string;
	id: string;
	image: string;
	title: string;
	price: string;
	category: string;
}

// Определение класса для хранения состояния приложения
export class AppState extends Model<IAppState> {
	basket: HTMLElement[];
	catalog: LotItem[];
	orderList: LotItem[];
	order: IOrder = {email: '',phone: '',items: [],payment: '',address: '',total: 0,};
	preview: string | null;
	formErrors: FormErrors = {};

constructor(data: Partial<IAppState>, events: IEvents) {
	super(data, events);
	this.setBasket();
	this.setOrderList();
}

// Установка списка товаров в каталоге
setCatalog(items: IProduct[]) {
	this.catalog = items.map((item) => new LotItem(item, this.events));
	this.emitChanges('items:changed', { catalog: this.catalog });
}

setOrderList() {
	this.orderList = [];
}

setBasket() {
	this.basket = [];
}

// Установка предпросмотра товара
setPreview(item: LotItem) {
	this.preview = item.id;
	this.emitChanges('preview:changed', item);
}

setOrderField(field: keyof IContactForm, value: string) {
	this.order[field] = value;

	if (this.validationOrder()) {
		this.events.emit('order:ready', this.order);
	}
}

setContactField(field: keyof IOrderFormData, value: string) {
	this.order[field] = value;

	if (this.validationOrder()) {
			this.events.emit('order:ready', this.order);
	}
}

// Валидация данных заказа
validationOrder() {
	const errors: typeof this.formErrors = {};
	if (!this.order.email.match(mailRegex)) {
		errors.email = 'Необходимо указать email';
	}
	if (!this.order.phone.match(phoneRegex)) {
		errors.phone = 'Необходимо указать телефон';
	}
	if (!this.order.address) {
		errors.address = 'Необходимо указать адрес';
	}
	this.formErrors = errors;
	this.events.emit('formErrors:change', this.formErrors);
	return Object.keys(errors).length === 0;
}

getOrderList() {
	return this.orderList;
	}
}



