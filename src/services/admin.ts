import HttpClient from '../plugins/HttpClient';
const httpClient = new HttpClient();

type AdminCreatePayload = {
    nome: string;
    email: string;
    senha: string;
    estabelecimentos_id: string | number;
    funcoes_estabelecimentos_id: string | number;
};

type AdminUpdatePayload = {
    nome?: string;
    email?: string;
    senha?: string;
    funcoes_estabelecimentos_id?: string | number;
};

export default class EstablishmentAdminService {
    static async getAll(page: number = 1, qty: number = 25, order = 'alfabetica'): Promise<any> {
        const url = `/estabelecimento/admins-estabelecimentos?page=${page}&quantidade=${qty}&ordem=${order}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async search(term: string, page: number = 1, qty: number = 25, order = 'alfabetica'): Promise<any> {
        const url = `/estabelecimento/admins-estabelecimentos?pesquisa=${term}&page=${page}&quantidade=${qty}&ordem=${order}`;
        // await httpClient.cancelRequest();
        const res = await httpClient.get(url);
        return res;
    }
    static async create(payload: AdminCreatePayload): Promise<any> {
        const url = '/estabelecimento/admins-estabelecimentos';
        const res = await httpClient.post(url, payload);
        return res;
    }
    static async update(id: string | number, payload: AdminUpdatePayload): Promise<any> {
        const url = `/estabelecimento/admins-estabelecimentos/${id}`;
        const res = await httpClient.put(url, payload);
        return res;
    }
    static async remove(id: number | string) {
        const url = `/estabelecimento/admins-estabelecimentos/${id}`;
        const res = await httpClient.delete(url);
    }
}
