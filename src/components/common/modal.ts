import {Component} from '../base/component';
import {IEvents} from '../base/events';
import {ensureElement} from '../../utils/utils';

interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	protected events: IEvents;
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLDivElement>('.modal__content', container);
		this._closeButton.addEventListener('click', () => this.close());
		this.container.addEventListener('mousedown', (evt: MouseEvent) => {
			const target = evt.target as HTMLElement;
			if (target.classList.contains('modal')) {
				this.close();
			}
		});
	}

    set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.toggleElementClass(this.container, 'modal_active', true);
		this.events.emit('modal:open');
	}

	close() {
		this.toggleElementClass(this.container, 'modal_active', false);
		this.events.emit('modal:close');
	}

}

