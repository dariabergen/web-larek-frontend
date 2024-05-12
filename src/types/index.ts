export interface IProduct {
	id: string; 
	description: string; 
	image: string; 
	title: string; 
	category: string; 
	price: number | null;
}

export interface ISuccess {
	total: number;
}

export interface IAppData {
	catalog: IProduct[]; 
	basket: string[]; 
	order: IOrder; 
}

export interface IOrderForm {
	email: string; 
	phone: string; 
}

export interface IOrderContact {
	payment: string; 
	address: string; 
}

export interface IOrder extends IOrderForm, IOrderContact {
	total: number; 
	items: string[]; 
}

export interface IOrderAnswer {
	total: number; 
}

export interface IPage {
	counter: HTMLElement;
	catalog: HTMLElement; 
	basket: HTMLElement; 
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IModalData {
	content: HTMLElement;
}

export interface IBasket {
	items: HTMLElement[];
	total: number;
}

export interface ICard {
	id: string;
	title: string;
	category: string;
	description: string;
	image: string;
	price: number | null;
	index?: number;
}

export type CatalogItemStatus = {
	category: 'софт-скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное';
};