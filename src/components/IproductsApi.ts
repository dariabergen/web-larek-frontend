import { ApiListResponse, IProduct, IOrder, IOrderResult } from '../types';
import { Api } from './base/api';

export interface IWebLarekApi {
	getItemList: () => Promise<IProduct[]>;
}

export class WebLarekApi extends Api implements IWebLarekApi {
	readonly cdn: string;
	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getItemList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	postOrder(orderData: IOrder): Promise<IOrderResult> {
		return this.post('/order', orderData).then((data: IOrderResult) => data);
	}
}
