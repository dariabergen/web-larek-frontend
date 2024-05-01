
// Импорт необходимых модулей и типов данных
import {Component} from "./base/component";
import {ensureElement} from "../utils/utils";
import {settingsCategory} from "../utils/constants";
import {EventEmitter} from "./base/events";
import {ICard, ICardActions} from "../types";

// Класс для отображения карточки товара
export class Card extends Component<ICard> {
    protected _title: HTMLElement; // Заголовок карточки
    protected _image?: HTMLImageElement; // Изображение товара
    protected _description?: HTMLElement; // Описание товара
    protected _button?: HTMLButtonElement; // Кнопка действия
    protected _category?: HTMLElement; // Категория товара
    protected _price?: HTMLElement; // Цена товара
    protected _indexElement?: HTMLElement; // Элемент индекса
    protected _deleteButton?: HTMLElement; // Кнопка удаления

    // Конструктор класса
    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        // Инициализация элементов карточки
        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = container.querySelector(`.${blockName}__image`);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__text`);
        this._category = container.querySelector(`.${blockName}__category`);
        this._price = container.querySelector(`.${blockName}__price`);
        this._indexElement = this.container.querySelector('.basket__item-index');

        // Обработка события клика по кнопке действия
        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    // Установка категории товара
    set category(value: string) {
        this.setText(this._category, value);
    }  

    // Установка цены товара
    set price(value: string) {
        this.setText(this._price, value);
    }

    // Установка заголовка карточки
    set title(value: string) {
        this.setText(this._title, value);
    }

    // Установка текста на кнопке действия
    set buttonText(value: string) {
        this.setText(this._button, value);
    }

    // Установка изображения товара
    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    // Увеличение индекса элемента
    setIndexElement() {
        this.setText(this._indexElement, String(Number(this._indexElement.textContent) + 1))
    }

    // Установка описания товара
    set description(value: string | string[]) {
        // Если описание представлено массивом строк, создать соответствующие элементы
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }

    // Получение текста на кнопке действия
    get buttonText(){
        return this._button.textContent;
    }

    // Получение кнопки действия
    get button(){
        return this._button;
    }
}

// Класс для отображения товара в каталоге
export class CatalogItem extends Card {
    protected _status: HTMLElement; // Статус товара

    // Конструктор класса
    constructor(container: HTMLElement, protected events: EventEmitter, actions?: ICardActions) {
        super('card', container, actions);

        // Инициализация кнопки удаления
        this._indexElement = this.container.querySelector('.basket__item-index');
        this._deleteButton = this.container.querySelector('.basket__item-delete');

        // Обработка события клика по кнопке удаления
        if(this._deleteButton){
            this._deleteButton.addEventListener('click', () => {
                events.emit('order:delete', this._indexElement );
            })
        } 
    }
 
    // Метод для рендеринга товара
    render(data?: Partial<ICard>): HTMLElement {
        Object.assign(this as object, data ?? {});

        // Установка цены товара и категории
        if (data.price) {
            this.price = data.price + " синапсов";
        } else {
            this.price = 'Бесценно';
        }
        if (data.category) {
            this.toggleElementClass(this._category, settingsCategory[data.category as keyof typeof settingsCategory], true);
        }
        if (data.index) {
            this.setText(this._indexElement, data.index)
        }

        return this.container;
    }  
}