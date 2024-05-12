import './scss/styles.scss';

import { AppState } from './components/appData';
import { Basket } from './components/basket';
import { Card } from './components/card';
import { Contacts } from './components/contactForm';
import { WebLarekApi } from './components/IproductsApi';
import { Order } from './components/orderForm';
import { Page } from './components/pageView';
import { Success } from './components/succesView';
import { EventEmitter } from './components/base/events';
import { Form } from './components/common/form';
import { Modal } from './components/common/modal';
import { FormName, IAnyForm, IContactsForm, IProduct, IOrderForm } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const api = new WebLarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppState({}, events);
const page = new Page(document.body, events);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

const onFormErrorsChange = (input: {
	errors: Partial<IAnyForm>;
	form: Form<IAnyForm>;
}) => {
	input.form.valid = Object.values(input.errors).every((text) => {
		return !text;
	});
	input.form.errors = Object.values(input.errors)
		.filter((i) => !!i)
		.join('; ');
};

const renderForm = (formName: FormName) => {
	const form = formName === 'order' ? order : contacts;
	form.cleanFieldValues();
	modal.render({
		content: form.render({
			valid: false,
			errors: [],
		}),
	});
};

events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			image: item.image,
			category: item.category,
		});
	});
});

events.on('card:select', (item: IProduct) => {
	const card: Card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (!appData.isInBasket(item)) {
				appData.addBasket(item);
			} else {
				appData.removeBasket(item);
			}
			card.inBasket = appData.isInBasket(item);
		},
	});
	card.inBasket = appData.isInBasket(item);
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
		}),
	});
});

events.on('basket:changed', () => {
	page.counter = appData.getNumberBasket();
	basket.items = appData.basket.map((item, index) => {
		const card: Card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => appData.removeBasket(item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	const totalNumber = appData.getTotalBasket();
	basket.total = totalNumber;
	basket.disableButton(!totalNumber);
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('basket:open', () => {
	modal.render({ content: basket.render() });
});

events.on('order:open', () => {
	appData.cleanOrder();
	renderForm('order');
});

events.on(
	/^(order|contacts)\..*:change/,
	(data: { field: keyof IAnyForm; value: string }) => {
		appData.setField(data.field, data.value);
	}
);

events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
	onFormErrorsChange({ errors, form: order });
});

events.on('contactsFormErrors:change', (errors: Partial<IContactsForm>) => {
	onFormErrorsChange({ errors, form: contacts });
});

events.on('order:submit', () => {
	renderForm('contacts');
});

events.on('contacts:submit', () => {
	appData.prepareOrder();
	api
		.postOrder(appData.getOrderData())
		.then(() => {
			modal.render({
				content: success.render({
					total: appData.getTotalBasket(),
				}),
			});
			appData.cleanBasketState();
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			appData.cleanOrder();
		});
});

events.on('success:submit', () => modal.close());

api
	.getItemList()
	.then((result) => {
		appData.setCatalog(result);
	})
	.catch((err) => {
		console.error(err);
	});
