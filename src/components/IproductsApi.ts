import { Api, ApiListResponse } from './base/api';
import { IProduct, IOrderAnswer, IOrder } from '../types/index';
interface IWebLarekApi {
	getProductList: () => Promise<IProduct[]>; 
	orderProduct: (value: IOrder) => Promise<IOrderAnswer>; 
}
export class WebLarekApi extends Api implements IWebLarekApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderProduct(value: IOrder): Promise<IOrderAnswer> {
		return this.post('/order', value).then((data: IOrderAnswer) => data);
	}
}
