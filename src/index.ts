import './scss/styles.scss';
import { AppState } from './components/appData';
import { WebLarekApi } from './components/IproductsApi';
import { Card, CardBasket, PreviewCard } from './components/card';
import { Page } from './components/pageView';
import { IProduct, IOrderForm } from './types';
import { Modal } from './components/modal';
import { Basket } from './components/basket';
import { Contacts } from './components/contactForm';
import { Order } from './components/orderForm';
import { Success } from './components/succesView';

import { API_URL, CDN_URL } from './utils/constants'; 
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';

const api = new WebLarekApi(CDN_URL, API_URL);
const events = new EventEmitter();

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const appState = new AppState({}, events); 

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const delivery = new Order(cloneTemplate(orderTemplate), events);
const contact = new Contacts(cloneTemplate(contactsTemplate), events);

events.on('preview:changed', (item: IProduct) => {
	const card = new PreviewCard(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('card:add', item),
	});
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
		}),
	});
});

events.on('items:changed', () => {
	page.catalog = appState.cardList.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

events.on('basket:open', () => {
	basket.setDisabled(basket.button, appState.statusBasket);
	basket.total = appState.getTotal();
	let i = 1;
	basket.items = appState.basketList.map((item) => {
		const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:remove', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: i++,
		});
	});
	modal.render({
		content: basket.render(),
	});
});

events.on('card:select', (item: IProduct) => {
	appState.setPreview(item);
});

events.on('card:add', (item: IProduct) => {
	const findRepeatId = appState.basketList.find((element: IProduct) => {
		return element.id === item.id;
	});
	if (!findRepeatId) {
		appState.addCardToBasket(item);
		appState.setCardToBasket(item);
		page.counter = appState.basketList.length;
	}
	modal.close();
});

events.on('card:remove', (item: IProduct) => {
	appState.deleteCardToBasket(item);
	page.counter = appState.basketList.length;
	basket.setDisabled(basket.button, appState.statusBasket);
	basket.total = appState.getTotal();
	let i = 1;
	basket.items = appState.basketList.map((item) => {
		const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:remove', item),
		});
		return card.render({
			index: i++,
			title: item.title,
			price: item.price,
		});
	});
	modal.render({
		content: basket.render(),
	});
});

events.on('order:open', () => {
	modal.render({
		content: delivery.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
	appState.order.items = appState.basket.map((item) => item.id);
});

events.on('payment:change', (item: HTMLButtonElement) => {
	appState.order.payment = item.name;
});

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone, address, payment } = errors;
	delivery.valid = !address && !payment;
	contact.valid = !email && !phone;
	delivery.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
	contact.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on('order:submit', () => {
	appState.order.total = appState.getTotal();
	modal.render({
		content: contact.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	api
		.orderCard(appState.order)
		.then((result) => {
			appState.clearBasket();
			page.counter = appState.basketList.length;
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			const pay: string = result.total;
			modal.render({
				content: success.render({
					total: pay,
				}),
			});
			appState.clearOrder();
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appState.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appState.setContactsField(data.field, data.value);
	}
);

api
	.getCardList()
	.then(appState.setCatalog.bind(appState))
	.catch((err) => {
		console.log(err);
	});
