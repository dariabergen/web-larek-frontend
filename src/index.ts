// Импорт стилей
import './scss/styles.scss';

// Импорт компонентов
import { ItemsAPI } from './components/IproductsApi';
import { Page } from './components/pageView';
import { CatalogItem } from './components/card';
import { Modal } from './components/common/modal';
import { Basket } from './components/basket';
import { ContactForm } from './components/contact';
import { Order } from './components/order';
import { Success } from './components/succesView';

// Импорт базовых утилит и констант
import { API_URL, CDN_URL, settingsTemplates } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';

// Импорт типов и данных
import { AppState, LotItem } from './components/appData';
import { IContactForm, IOrderFormData, CatalogChangeEvent } from './types';

// Создание экземпляра класса EventEmitter для работы с событиями
const events = new EventEmitter();

// Создание экземпляра класса ItemsAPI для работы с сервером
const api = new ItemsAPI(CDN_URL, API_URL);

// Получение HTML-шаблонов
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>(
	settingsTemplates.cardCatalogTemplate
);
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>(
	settingsTemplates.cardPreviewTemplate
);
const cardBasketTemplate = ensureElement<HTMLTemplateElement>(
	settingsTemplates.cardBasketTemplate
);
const basketTemplate = ensureElement<HTMLTemplateElement>(
	settingsTemplates.basketTemplate
);
const orderTemplate = ensureElement<HTMLTemplateElement>(
	settingsTemplates.orderTemplate
);
const contactTemplate = ensureElement<HTMLTemplateElement>(
	settingsTemplates.contactsTemplate
);
const modalContainer = ensureElement<HTMLTemplateElement>('#modal-container');
const successTemplate = ensureElement<HTMLTemplateElement>(
	settingsTemplates.successTemplate
);

// Создание экземпляров классов с использованием соответствующих шаблонов и настройкой событийной системы
const appData = new AppState({}, events);
const page = new Page(document.body, events);
const modal = new Modal(modalContainer, events);
const contact = new ContactForm(cloneTemplate(contactTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

// Получение списка товаров с сервера и установка каталога при успешном ответе
api.getItemList().then(appData.setCatalog.bind(appData)).catch(console.error);

// Обработчик события изменения предпросмотра товара
events.on('preview:changed', (item: LotItem) => {
	const card = new CatalogItem(cloneTemplate(cardPreviewTemplate), events, {
		onClick: () => {
			if (card.buttonText === 'Купить') {
				appData.orderList.push(item);
				card.buttonText = 'В корзину';
				page.counter = appData.getOrderList().length;
				events.emit('buy:item', item);
			} else {
				events.emit('basket:open', item);
			}
		},
	});

	// Проверка наличия товара в корзине и блокировка соответствующих кнопок
	if (appData.orderList.includes(item)) {
		card.buttonText = 'Уже в корзине';
		card.setDisabled(card.button, true);
	}

	if (!item.price) {
		card.buttonText = 'Нельзя купить';
		card.setDisabled(card.button, true);
	}

	// Отображение карточки товара в модальном окне
	modal.render({
		content: card.render({
			title: item.title,
			category: item.category,
			image: item.image,
			description: item.description,
			price: item.price,
		}),
	});
});

events.on('card:select', (item: LotItem) => {
	appData.setPreview(item);
});

events.on<CatalogChangeEvent>('items:changed', () => {
	page.gallery = appData.catalog.map((item) => {
		const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), events, {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
		});
	});
});

// Обработчик покупки товара
events.on('buy:item', (item: LotItem) => {
	const card = new CatalogItem(cloneTemplate(cardBasketTemplate), events, {
		onClick: () => events.emit('basket:open', item),
	});
	appData.basket.push(
		card.render({
			title: item.title,
			price: item.price,
			index: appData.orderList.length,
		})
	);
});

events.on('basket:open', () => {
	basket.items = appData.basket;
	if (appData.basket.length === 0) {
		basket.setDisabled(basket.button, true);
	} else {
		basket.setDisabled(basket.button, false);
	}
	basket.total = appData.orderList.reduce(
		(total, currentValue) => total + Number(currentValue.price),
		0
	);
	modal.render({
		content: basket.render(),
	});
});

events.on('contacts:open', () => {
	modal.render({
		content: contact.render({ phone: '', email: '', valid: false, errors: [] }),
	});
});

events.on('order:open', () => {
	modal.render({
		content: order.render({ address: '', valid: false, errors: [] }),
	});
});

events.on('order:delete', (element: HTMLElement) => {
	appData.orderList.splice(Number(element.textContent) - 1, 1);
	appData.basket.length = 0;
	appData.orderList.forEach((item, i) => {
		const card = new CatalogItem(cloneTemplate(cardBasketTemplate), events);
		appData.basket.push(
			card.render({
				title: item.title,
				price: item.price,
				index: i + 1,
			})
		);
	});

	// Обновление счетчика товаров и отображение корзины
	page.counter = appData.orderList.length;
	events.emit('basket:open');
});

events.on('success:open', () => {
	appData.order.total = basket.total;
	appData.order.payment = order.payment;
	appData.order.items = appData.getOrderList().map((element) => {
		return element.id;
	});
	api
		.orderItems(appData.order)
		.then(() => {
			appData.basket.length = 0;
			appData.orderList = [];
			page.counter = appData.orderList.length;
			success.total = basket.total;
			modal.render({ content: success.render({}) });
		})
		.catch(console.error);
});

events.on('order:done', () => {
	modal.close();
});

events.on('formErrors:change', (errors: Partial<IContactForm>) => {
	const { email, phone } = errors;
	contact.valid = !email && !phone;
	contact.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on('formErrors:change', (errors: Partial<IOrderFormData>) => {
	const { address } = errors;
	order.valid = !address;
	order.errors = Object.values({ address })
		.filter((i) => !!i)
		.join('; ');
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderFormData; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);
