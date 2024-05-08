export interface IView<T> {
	toggleElementClass(element: HTMLElement, className: string, force?: boolean): void;
	setText(element: HTMLElement, value: unknown): void;
	setDisabled(element: HTMLElement, state: boolean): void;
	setHidden(element: HTMLElement): void;
	setVisible(element: HTMLElement): void;
	setImage(element: HTMLElement, src: string, alt?: string): void;
	render(data?: Partial<T>): HTMLElement;
}

export interface IModel {
	emitChanges(event: string, data?: object): void;
}
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IFormState {
	valid: boolean;
	error: string;
}

export interface IForm extends IFormState {
	render(data?: IFormState): HTMLElement;
}

export interface IContactForm {
	email: string;
	phone: string;
}

export interface IIdentifier {
	id: string;
}

export interface IOrderList {
	total: number;
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type ICatalogCard = Omit<IProduct, 'description'>;
export type IPreviewCard = IProduct & { valid: boolean; state: boolean };
export type IBasketCard = Omit<IProduct, 'description' | 'category' | 'image'> & {
index: number;
};
export type PaymentMethod = 'cash' | 'card';

export interface IOrderFormDatta {
	payment: PaymentMethod;
	address: string;
}

export type IOrderData = IOrderFormDatta & IContactForm & IOrderList;

export interface IOrderBuilder {
	delivery: IOrderFormDatta;
	contacts: IContactForm;
	orderList: IOrderList;
	result: IOrderData;
}

export interface IProductsAPI {
	getItem(id: string): Promise<IProduct>;
	getItemList(): Promise<IProduct[]>;
	orderItems(order: IOrderData): Promise<IOrderResult>;
}

export interface IInputData {
	field: string;
	value: string;
}

