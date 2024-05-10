import './scss/styles.scss';

import {ItemsAPI} from './components/IproductsApi';
import {CatalogItem, PreviewCard, BasketCard} from './components/card';
import {Catalog} from './components/catalog';
import {cloneTemplate, ensureElement} from './utils/utils';

import {CDN_URL, API_URL} from './utils/constants';
import {EventEmitter} from './components/base/events';

import {ICatalogCard,IContactForm,IOrderFormDatta,IForm,IFormState,IIdentifier,IOrderData,
	    IOrderList,IOrderResult,IProduct,PaymentMethod} from './types';
import {Page} from './components/pageView';
import {Modal} from './components/common/modal';
import {Basket} from './components/basket';
import {BasketView} from './components/basketView';
import {ContactForm, OrderForm} from './components/contact';
import {INPUT_ERROR_TEXT, EVENTS} from './utils/constants';
import {Success} from './components/succesView';
import {OrderBuilder} from './components/orderBilder';

const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const pageContent = ensureElement<HTMLElement>('.page');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const modalContainer = ensureElement<HTMLDivElement>('#modal-container');

const api = new ItemsAPI(CDN_URL, API_URL);
const emitter = new EventEmitter();
const catalog = new Catalog({}, emitter);
const basket = new Basket({}, emitter);
const orderBuilder = new OrderBuilder({}, emitter);
const page = new Page(pageContent, emitter);
const modal = new Modal(modalContainer, emitter);
const contactsUserInt = new ContactForm(cloneTemplate(contactsTemplate), emitter);
const successUserInt = new Success(cloneTemplate(successTemplate), emitter);
const previewUserInt = new PreviewCard(cloneTemplate(cardPreviewTemplate), emitter);
const basketUserInt = new BasketView(cloneTemplate(basketTemplate), emitter);
const orderUserInt = new OrderForm(cloneTemplate(orderTemplate), emitter);


function validate(form: IForm) {
	const errorText = getErrorText(form);
	const validity: IFormState = { valid: form.valid, error: errorText };
	form.render(validity);
}

function getErrorText(form: IForm) {
	const errorText = !form.valid ? INPUT_ERROR_TEXT : '';
	return errorText;
}

emitter.on(EVENTS.ModalOpen, () => {
	page.lockScroll(true);
});

emitter.on(EVENTS.ModalClose, () => {
	page.lockScroll(false);
});

emitter.on(EVENTS.CatalogItemsChanged, (data: IProduct[]) => {
	const cardList = data.map((item) => {
		const card = new CatalogItem<ICatalogCard>(
			cloneTemplate(cardTemplate),
			emitter
		);
		return card.render(item);
	});
	page.render({ catalog: cardList });
});

emitter.on(EVENTS.CardSelect, (data: IIdentifier) => {
	modal.open();
	const product = catalog.find(data.id);
	if (product) {
		const previewData = Object.assign(product, {
			valid: Boolean(product.price),
			state: !basket.contains(data.id),
		});
		modal.render({ content: previewUserInt.render(previewData) });
	}
});

emitter.on(EVENTS.BasketOpen, () => {
	modal.open();
	modal.render({
		content: basketUserInt.render({
			price: basket.total,
			valid: basket.length === 0,
		}),
	});
});

emitter.on(EVENTS.BasketAdd, (data: IIdentifier) => {
	const product = catalog.find(data.id);
	basket.add(product);
});

emitter.on(EVENTS.BasketRemove, (data: IIdentifier) => {
	basket.remove(data.id);
});

emitter.on(EVENTS.BasketItemsChanged, (data: IIdentifier) => {
	previewUserInt.render({ valid: true, state: !basket.contains(data.id) });
	page.render({ counter: basket.length });
	const cardList = basket.items.map((item, index) => {
		const cardData = Object.assign(item, { index: index + 1 });
		const card = new BasketCard(cloneTemplate(cardBasketTemplate), emitter);
		return card.render(cardData);
	});
	basketUserInt.render({
		list: cardList,
		valid: basket.length === 0,
		price: basket.total,
	});
});

emitter.on(EVENTS.OrderOpen, () => {
	const orderList: IOrderList = {
		total: basket.total,
		items: basket.getIdList(),
	};
	orderBuilder.orderList = orderList;

	modal.render({
		content: orderUserInt.render({
			valid: orderUserInt.valid,
			error: getErrorText(orderUserInt),
		}),
	});
});

emitter.on(EVENTS.OrderInput, () => {
	validate(orderUserInt);
});

emitter.on(EVENTS.OrderSubmit, () => {
	modal.render({
		content: contactsUserInt.render({
			valid: contactsUserInt.valid,
			error: getErrorText(contactsUserInt),
		}),
	});
});

emitter.on(EVENTS.ContactsInput, () => {
	validate(contactsUserInt);
});

emitter.on(EVENTS.ContactsSubmit, () => {  
	const apiObj: IOrderData = orderBuilder.result.toApiObject();
	api
		.orderItems(apiObj)
		.then((data: IOrderResult) => {
			modal.render({ content: successUserInt.render({ total: data.total }) });
	        orderUserInt.clear();
			contactsUserInt.clear();
			basket.clear();
		})
		.catch(console.error);
});

emitter.on(EVENTS.SuccessSubmit, () => {
	modal.close();
});

api
	.getItemList()
	.then((data) => {
		catalog.items = data;
	})
	.catch(console.error);
