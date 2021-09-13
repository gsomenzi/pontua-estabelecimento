import HttpClient from '../plugins/HttpClient';
const httpClient = new HttpClient();

type RoleCreatePayload = {
    nome: string;
};

type RoleUpdatePayload = {
    nome: string;
};

export default class RoleService {
    static async getAll(page: number = 1, qty: number = 25, order = 'alfabetica'): Promise<any> {
        const url = `/admin/funcoes?page=${page}&quantidade=${qty}&ordem=${order}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async search(term: string, page: number = 1, qty: number = 25, order = 'alfabetica'): Promise<any> {
        const url = `/admin/funcoes?pesquisa=${term}&page=${page}&quantidade=${qty}&ordem=${order}`;
        // await httpClient.cancelRequest();
        const res = await httpClient.get(url);
        return res;
    }
    static async create(payload: RoleCreatePayload): Promise<any> {
        const url = '/admin/funcoes';
        const res = await httpClient.post(url, payload);
        return res;
    }
    static async update(id: string | number, payload: RoleUpdatePayload): Promise<any> {
        const url = `/admin/funcoes/${id}`;
        const res = await httpClient.put(url, payload);
        return res;
    }
    static async remove(id: number | string) {
        const url = `/admin/funcoes/${id}`;
        const res = await httpClient.delete(url);
    }
}
