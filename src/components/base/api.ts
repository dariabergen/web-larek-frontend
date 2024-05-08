export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export class Api {
	readonly baseUrl: string;
	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	protected handleResponse(response: Response): Promise<object> {
		if (response.ok) return response.json();
		else
			return response
				.json()
				.then((data) => Promise.reject(data.error ?? response.statusText));
	}

	protected request(uri: string, options: RequestInit) {
		return fetch(this.baseUrl + uri, options).then(this.handleResponse);
	}

	get(uri: string) {
		return this.request(uri, {
			...this.options,
			method: 'GET',
		});
	}

	post(uri: string, data: object, method: ApiMethods = 'POST') {
		return this.request(uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		});
	}
}

export type ApiMethods = 'POST' | 'PUT' | 'DELETE';