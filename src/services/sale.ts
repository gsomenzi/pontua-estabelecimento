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
    static async getAll(page: number = 1, qty: number = 25, order = 'alfabetica', filters: any = null): Promise<any> {
        let url = `/estabelecimento/promocoes?page=${page}&quantidade=${qty}&ordem=${order}`;
        if (filters && typeof filters === 'object') {
            Object.entries(filters).map((filter) => {
                url = `${url}&${filter[0]}=${filter[1]}`;
            });
        }
        const res = await httpClient.get(url);
        return res;
    }
    static async search(term: string, page: number = 1, qty: number = 25, order = 'alfabetica'): Promise<any> {
        const url = `/estabelecimento/promocoes?pesquisa=${term}&page=${page}&quantidade=${qty}&ordem=${order}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async getOne(id: number | string): Promise<any> {
        const url = `/estabelecimento/promocoes/${id}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async create(payload: SaleCreatePayload): Promise<any> {
        const url = '/estabelecimento/promocoes';
        const res = await httpClient.post(url, payload);
        return res;
    }
    static async update(id: string | number, payload: SaleUpdatePayload): Promise<any> {
        const url = `/estabelecimento/promocoes/${id}`;
        const res = await httpClient.put(url, payload);
        return res;
    }
    static async remove(id: number | string) {
        const url = `/estabelecimento/promocoes/${id}`;
        const res = await httpClient.delete(url);
    }
}
