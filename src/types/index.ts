export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface ICard extends IProduct {
	index?: number;
}

export interface IAnyForm extends IOrderForm, IContactsForm {}

export interface IOrder extends IAnyForm {
	total: number;
	items: Uuid[];
}

export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	order: IOrder;
	orderFormErrors: OrderFormErrors;
	contactsFormErrors: ContactsFormErrors;
}

export type Uuid = string;

export interface IPage {
	cartCounter: number;
	catalog: HTMLElement[];
}

export interface IOrderForm {
	address: string;
	payment: string;
}
export interface IContactsForm {
	email: string;
	phone: string;
}

export type OrderFormErrors = Partial<Record<keyof IOrderForm, string>>;
export type ContactsFormErrors = Partial<Record<keyof IContactsForm, string>>;

export interface IOrderResult {
	id: Uuid;
	total: number;
}

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type FormName = 'order' | 'contacts';