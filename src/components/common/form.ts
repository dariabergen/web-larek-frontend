import {Component} from '../base/component';
import {IEvents} from '../base/events';
import {ensureAllElements, ensureElement} from '../../utils/utils';
import {IFormState} from '../../types';

export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
	protected _error: HTMLSpanElement;
	protected container: HTMLFormElement;
	protected events: IEvents;
	protected inputList: HTMLInputElement[];
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container);
		this.events = events;
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]',container);
		this.inputList = ensureAllElements<HTMLInputElement>('.form__input',container);
		this._error = ensureElement<HTMLSpanElement>('.form__errors', container);
        this.container.addEventListener('input', () => {this.emitInput();});

		this.container.addEventListener('submit', (evt: Event) => {evt.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	emitInput() {
		this.events.emit(`${this.container.name}:input`);
	}

	get valid(): boolean {
		return this.inputList.every((item) => item.value.length > 0);
	}

	set valid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}

	set error(value: string) {
		this.setText(this._error, value);
	}

	clear() {
		this.container.reset();
	}

	render(data?: Partial<T> & IFormState): HTMLElement {
		const { valid, error, ...inputs } = data;
		super.render({ valid, error });
		Object.assign(this, inputs);
		return this.container;
	}
}

