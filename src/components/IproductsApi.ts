import { ApiListResponse, IProduct, IOrder, ISuccess } from '../types';
import { Api } from './base/api';

interface IWebLakerApi {
	getCardList: () => Promise<IProduct[]>;
	getCardItem: (id: string) => Promise<IProduct>;
	orderCard: (order: IOrder) => Promise<ISuccess>;
}

export class WebLarekApi extends Api implements IWebLakerApi{
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getCardList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getCardItem(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((item: IProduct) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	orderCard(order: IOrder): Promise<ISuccess> {
		return this.post(`/order`, order).then((data: ISuccess) => data);
	}
}
