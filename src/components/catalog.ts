import {IEvents} from './base/events';
import {Model} from './base/model';
import {IProduct} from '../types';

interface ICatalogData {
	items: IProduct[];
}

export class Catalog extends Model<ICatalogData> {
	protected _items: IProduct[];
    constructor(data: Partial<ICatalogData>, events: IEvents) {
		super(data, events);
	}

	get items() {
		return this._items;
	}

	set items(list: IProduct[]) {
		this._items = list;
		this.emitChanges('catalog:items-changed', this._items);
	}

	find(id: string): IProduct | undefined {
		return this._items.find((item) => item.id === id);
	}
}





