import './scss/styles.scss';

import { WebLarekApi } from './components/IproductsApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/appData';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Card, CardView } from './components/card';
import { Page } from './components/pageView';
import { Modal } from './components/common/modal';
import { Order } from './components/orderForm';
import { IOrder, IProduct, IOrderForm } from './types';
import { Contacts } from './components/contactForm';
import { Basket } from './components//basket';
import { Success } from './components//succesView';

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const appData = new AppState({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(
	cloneTemplate<HTMLTemplateElement>(basketTemplate),
	events
);
const order = new Order(cloneTemplate<HTMLFormElement>(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

events.on('card:select', (item: IProduct) => {
	const card = new CardView(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('card:add', item),
	});
	modal.render({
		content: card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
			description: item.description,
		}),
	});

	if (item.price === null) {
		card.setDisabled(card.buttonElement, true);
	} else if (appData.containsProduct(item)) {
		card.setDisabled(card.buttonElement, true);
	}
});

events.on('card:add', (item: IProduct) => {
	appData.addOrderID(item);
	appData.addToBasket(item);
	page.counter = appData.basket.length;
	modal.close();
});

events.on('onChange', () => {
    basket.total = appData.getTotal();
    basket.setDisabled(basket.button, appData.isEmpty);
    page.counter = appData.basket.length;
    basket.items = appData.basket.map((item, index) => {
        const card = new CardView(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('card:remove', item),
        });
        return card.render({
            title: item.title,
            price: item.price,
            index: index + 1,
        });
    });
    modal.render({
        content: basket.render(),
    });
});

events.on('basket:open', () => {
	events.emit('onChange');
});

events.on('card:remove', (item: IProduct) => {
	appData.removeBasket(item);
	appData.removeOrderID(item);
	events.emit('onChange');
	
});

events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			payment: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order:submit', () => {
	appData.order.total = appData.getTotal();
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { email, phone, address, payment } = errors;
	order.valid = !address && !payment;
	contacts.valid = !email && !phone;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on('payment:change', (item: HTMLButtonElement) => {
	appData.order.payment = item.name;
	appData.validateOrderForm();
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

events.on('contacts:submit', () => {
	api
		.orderProduct(appData.order)
		.then((res) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			modal.render({
				content: success.render({
					total: res.total,
				}),
			});

			appData.clearBasket();
			page.counter = 0;
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

api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
