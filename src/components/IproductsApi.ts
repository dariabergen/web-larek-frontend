import { Api } from "./base/api";
import { ApiListResponse, IProduct, IProductsAPI, IOrder, IOrderSuccess } from "../types";


export class ItemsAPI extends Api implements IProductsAPI {
    readonly cdn: string;
    
    constructor(cdn: string, baseUrl: string, options?: RequestInit){
        super(baseUrl, options);
        this.cdn = cdn;
    }

    // Получение информации о товаре по его идентификатору
    getItem(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    // Получение списка товаров
    getItemList(): Promise<IProduct[]>{
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    orderItems(order: IOrder): Promise<IOrderSuccess> {
        return this.post('/order', order).then(
            (data: IOrderSuccess) => data
        );
    }
}