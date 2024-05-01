import { LotItem } from '../components/appData';

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type ApiMethods = 'POST' | 'PUT' | 'DELETE';

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IModalData {
	content: HTMLElement;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export interface ISuccess {
	total: number;
}

export interface IContactForm {
	email: string;
	phone: string;
}

export interface IOrderFormData {
	payment: string;
	address: string;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrder extends IContactForm {
	payment: string;
	address: string;
	items: string[];
	total: number;
}

export interface IOrderSuccess extends IOrder {
	id: string;
	total: number;
}

export interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export interface IAppState {
	gallery: IProduct[];
	basket: string[];
	preview: string | null;
	order: IOrder | null;
}

export interface ICard {
	title: string;
	description?: string | string[];
	image: string;
	category: string;
	price?: string;
	index?: number;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IPageState {
	counter: number;
	gallery: HTMLElement[];
	locked: boolean;
}

export interface IProductsAPI {
	getItemList: () => Promise<IProduct[]>;
	getItem: (id: string) => Promise<IProduct>;
	orderItems: (order: IOrder) => Promise<IOrderSuccess>;
}

export type CatalogChangeEvent = {
	catalog: LotItem[];
};
