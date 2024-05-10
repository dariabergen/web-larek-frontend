
import {IOrderData,PaymentMethod} from '../types';


export interface IOrder extends IOrderData {
	toApiObject(): IOrderData;
}
export class Order implements IOrder {
	protected _payment: PaymentMethod;
	protected _address: string;
	protected _email: string;
	protected _phone: string;
	protected _total: number;
	protected _items: string[];

	set payment(value: PaymentMethod) {
		this._payment = value;
	}

	set address(value: string) {
		this._address = value;
	}

	set email(value: string) {
		this._email = value;
	}

	set phone(value: string) {
		this._phone = value;
	}

	set total(value: number) {
		this._total = value;
	}

	set items(list: string[]) {
		this._items = list;
	}

	toApiObject(): IOrderData {
		return {
			payment: this._payment,
			email: this._email,
			phone: this._phone,
			address: this._address,
			total: this._total,
			items: this._items,
		};
	}
}


