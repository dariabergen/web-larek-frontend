export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface ISuccess {
	id: string;
	total: string;
}

export interface IAppData {
	cardList: IProduct[];
	basket: string[];
	order: IOrder | null;
	preview: string | null;
	formErrors: TFormErrors;
}

export interface IOrderSuccess {
	id: string;
	total: number;
}

export interface IModalData {
	content: HTMLElement;
}

export interface IOrderForm {
	payment?: string;
	address?: string;
	phone?: string;
	email?: string;
	total?: string | number;
}

export interface IOrder extends IOrderForm {
	items: string[];
}

export interface IOrder extends IOrderForm {
	items: string[];
}

export interface IBasket {
	items: string[];
	total: number;
}

export interface IProductBasket {
	index: number;
	title: string;
	price: number;
}

export interface ISuccessActions {
	onClick: () => void;
}

export interface IModal {
	content: HTMLElement;
}

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export interface IActions {
	onClick: (event: MouseEvent) => void;
}

export interface IPage {
	cardList: HTMLElement[];
}

export interface IPreviewCard {
	text: string;
}

export interface IFormValid {
	valid: boolean;
	errors: string[];
}

export type TFormErrors = Partial<Record<keyof IOrder, string>>;
export type FormErrors = Partial<Record<keyof IOrder, string>>;

export enum CardCategoryEnum {
	'софт-скил' = 'soft',
	'другое' = 'other',
	'дополнительное' = 'additional',
	'кнопка' = 'button',
	'хард-скил' = 'hard',
}