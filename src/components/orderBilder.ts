import {IEvents} from './base/events';
import {IOrderFormDatta,IContactForm,IOrderBuilder,IOrderList} from '../types';
import {Model} from './base/model'
import { Order, IOrder} from './order';

export class OrderBuilder extends Model<IOrderBuilder> {
	protected order: IOrder;

	constructor(data: Partial<IOrderBuilder>, events: IEvents) {
		super(data, events);
		this.order = new Order();
	}

	set delivery(delivery: IOrderFormDatta) {
		this.order.payment = delivery.payment;
		this.order.address = delivery.address;
	}

    set contacts(contacts: IContactForm) {
		this.order.email = contacts.email;
		this.order.phone = contacts.phone;
	}

	set orderList(orderList: IOrderList) {
		this.order.total = orderList.total;
		this.order.items = orderList.items;
	}

	get result(): IOrder {
		return this.order;
	}
}