import HttpClient from '../plugins/HttpClient';
const httpClient = new HttpClient();

type AdminCreatePayload = {
    nome: string;
};

type AdminUpdatePayload = {
    nome: string;
};

export default class AdminService {
    static async getAll(page: number = 1, qty: number = 25, order = 'alfabetica'): Promise<any> {
        const url = `/admin/admins?page=${page}&quantidade=${qty}&ordem=${order}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async search(term: string, page: number = 1, qty: number = 25, order = 'alfabetica'): Promise<any> {
        const url = `/admin/admins?pesquisa=${term}&page=${page}&quantidade=${qty}&ordem=${order}`;
        // await httpClient.cancelRequest();
        const res = await httpClient.get(url);
        return res;
    }
    static async create(payload: AdminCreatePayload): Promise<any> {
        const url = '/admin/admins';
        const res = await httpClient.post(url, payload);
        return res;
    }
    static async update(id: string | number, payload: AdminUpdatePayload): Promise<any> {
        const url = `/admin/admins/${id}`;
        const res = await httpClient.put(url, payload);
        return res;
    }
    static async remove(id: number | string) {
        const url = `/admin/admins/${id}`;
        const res = await httpClient.delete(url);
    }
}
