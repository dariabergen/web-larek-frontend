export abstract class Component<T> {
    // Конструктор принимает элемент-контейнер, в котором будет отображаться компонент
    protected constructor(protected readonly container: HTMLElement) {
    }

    // Метод для переключения класса элемента
    toggleElementClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    // Метод для установки текстового содержимого элемента
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    // Метод для установки состояния доступности элемента
    setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }

    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    protected hideElement(element: HTMLElement) {
        element.style.display = 'none';
    }

    protected showElement(element: HTMLElement) {
        element.style.removeProperty('display');
    }
 
    // Метод для отрисовки компонента с возможностью передачи данных
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}