import HttpClient from '../plugins/HttpClient';
const httpClient = new HttpClient();

type SaleCreatePayload = {
    nome: string;
    descricao: string;
    tipo_pontuacao: 'pontos' | 'quantidade';
    pontos?: number;
    quantidade?: number;
    ativo: boolean;
    regras: string;
    estabelecimentos_id: string | number;
};

type SaleUpdatePayload = {
    nome?: string;
    descricao?: string;
    tipo_pontuacao?: 'pontos' | 'quantidade';
    pontos?: number;
    quantidade?: number;
    ativo?: boolean;
    regras?: string;
};

export default class SaleService {
    static async getAll(page: number = 1, qty: number = 25, order = 'alfabetica'): Promise<any> {
        const url = `/admin/promocoes?page=${page}&quantidade=${qty}&ordem=${order}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async getAllByEstablishment(
        id: number | string,
        page: number = 1,
        qty: number = 25,
        order = 'alfabetica'
    ): Promise<any> {
        const url = `/admin/promocoes?estabelecimento=${id}&page=${page}&quantidade=${qty}&ordem=${order}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async getOne(id: number | string): Promise<any> {
        const url = `/admin/promocoes/${id}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async create(payload: SaleCreatePayload): Promise<any> {
        const url = '/admin/promocoes';
        const res = await httpClient.post(url, payload);
        return res;
    }
    static async update(id: string | number, payload: SaleUpdatePayload): Promise<any> {
        const url = `/admin/promocoes/${id}`;
        const res = await httpClient.put(url, payload);
        return res;
    }
    static async remove(id: number | string) {
        const url = `/admin/promocoes/${id}`;
        const res = await httpClient.delete(url);
    }
}
