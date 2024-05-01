// Импорт базового компонента и интерфейса событийной системы
import {Component} from '../base/component';
import {IEvents} from '../base/events';

// Импорт вспомогательной функции ensureElement из утилит
import {ensureElement} from '../../utils/utils';

// Импорт интерфейса состояния формы из типов
import {IFormState} from '../../types';

// Класс Form<T> представляет собой компонент формы
export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        // Инициализация элементов формы
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        // Обработчик изменений ввода
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        // Обработчик отправки формы
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    // Обработчик изменения ввода
    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value,
        });
    }

    // Установка состояния валидности формы
    set valid(value: boolean) {
        this.setDisabled(this._submit, !value);
    }

    // Установка текста ошибок
    set errors(value: string) {
        this.setText(this._errors, value);
    }

    // Рендеринг формы с указанным состоянием
    render(state: Partial<T> & IFormState) {
        const { valid, errors, ...inputs } = state;
        super.render({ valid, errors });
        Object.assign(this, inputs);
        return this.container;
    }
}