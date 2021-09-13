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
        const url = `/admin/admins-estabelecimentos?page=${page}&quantidade=${qty}&ordem=${order}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async getAllByEstablishment(
        id: number | string,
        page: number = 1,
        qty: number = 25,
        order = 'alfabetica'
    ): Promise<any> {
        const url = `/admin/admins-estabelecimentos?estabelecimento=${id}&page=${page}&quantidade=${qty}&ordem=${order}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async create(payload: AdminCreatePayload): Promise<any> {
        const url = '/admin/admins-estabelecimentos';
        const res = await httpClient.post(url, payload);
        return res;
    }
    static async update(id: string | number, payload: AdminUpdatePayload): Promise<any> {
        const url = `/admin/admins-estabelecimentos/${id}`;
        const res = await httpClient.put(url, payload);
        return res;
    }
    static async remove(id: number | string) {
        const url = `/admin/admins-estabelecimentos/${id}`;
        const res = await httpClient.delete(url);
    }
}
