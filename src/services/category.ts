import HttpClient from '../plugins/HttpClient';
const httpClient = new HttpClient();

type CategoryCreatePayload = {
    nome: string;
};

type CategoryUpdatePayload = {
    nome: string;
};

export default class CategoryService {
    static async getAll(page: number = 1, qty: number = 25, order = 'alfabetica'): Promise<any> {
        const url = `/admin/categorias-estabelecimentos?page=${page}&quantidade=${qty}&ordem=${order}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async search(term: string, page: number = 1, qty: number = 25, order = 'alfabetica'): Promise<any> {
        const url = `/admin/categorias-estabelecimentos?pesquisa=${term}&page=${page}&quantidade=${qty}&ordem=${order}`;
        // await httpClient.cancelRequest();
        const res = await httpClient.get(url);
        return res;
    }
    static async create(payload: CategoryCreatePayload): Promise<any> {
        const url = '/admin/categorias-estabelecimentos';
        const res = await httpClient.post(url, payload);
        return res;
    }
    static async update(id: string | number, payload: CategoryUpdatePayload): Promise<any> {
        const url = `/admin/categorias-estabelecimentos/${id}`;
        const res = await httpClient.put(url, payload);
        return res;
    }
    static async remove(id: number | string) {
        const url = `/admin/categorias-estabelecimentos/${id}`;
        const res = await httpClient.delete(url);
    }
}
