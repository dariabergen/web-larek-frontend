export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;
export enum EVENTS {
    SuccessSubmit = 'success:submit',
	ModalOpen = 'modal:open',
	ModalClose = 'modal:close',
    BasketOpen = 'basket:open',
	BasketAdd = 'basket:add',
	BasketRemove = 'basket:remove',
	CatalogItemsChanged = 'catalog:items-changed',
	CardSelect = 'card:select',
	BasketItemsChanged = 'basket:items-changed',
	OrderOpen = 'order:open',
	OrderInput = 'order:input',
	OrderSubmit = 'order:submit',
	ContactsInput = 'contacts:input',
	ContactsSubmit = 'contacts:submit',
}

export const INPUT_ERROR_TEXT = 'Заполните все поля';
export const BUY_BUTTON_TEXT = 'Купить';
export const REMOVE_BUTTON_TEXT = 'Удалить из корзины';
export const UNABLE_BUTTON_TEXT = 'Нельзя купить';
export const settings = {};
