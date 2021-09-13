import HttpClient from '../plugins/HttpClient';
const httpClient = new HttpClient();

type EstablishmentCreatePayload = {
    nome: string;
};

type EstablishmentUpdatePayload = {
    nome: string;
};

export default class EstablishmentService {
    static async getAll(page: number = 1, qty: number = 25, order = 'alfabetica'): Promise<any> {
        const url = `/admin/estabelecimentos?page=${page}&quantidade=${qty}&ordem=${order}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async search(term: string, page: number = 1, qty: number = 25, order = 'alfabetica'): Promise<any> {
        const url = `/admin/estabelecimentos?pesquisa=${term}&page=${page}&quantidade=${qty}&ordem=${order}`;
        // await httpClient.cancelRequest();
        const res = await httpClient.get(url);
        return res;
    }
    static async getOne(id: number | string): Promise<any> {
        const url = `/admin/estabelecimentos/${id}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async create(payload: EstablishmentCreatePayload): Promise<any> {
        const url = '/admin/estabelecimentos';
        const res = await httpClient.post(url, payload);
        return res;
    }
    static async update(id: string | number, payload: EstablishmentUpdatePayload): Promise<any> {
        const url = `/admin/estabelecimentos/${id}`;
        const res = await httpClient.put(url, payload);
        return res;
    }
    static async remove(id: number | string) {
        const url = `/admin/estabelecimentos/${id}`;
        const res = await httpClient.delete(url);
    }
}
