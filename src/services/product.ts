import HttpClient from '../plugins/HttpClient';
const httpClient = new HttpClient();

type ProductCreatePayload = {
    nome: string;
    descricao: string;
    tipo_pontuacao: 'pontos' | 'quantidade';
    pontos?: number;
    quantidade?: number;
    ativo: boolean;
    regras: string;
    estabelecimentos_id: string | number;
};

type ProductUpdatePayload = {
    nome?: string;
    descricao?: string;
    tipo_pontuacao?: 'pontos' | 'quantidade';
    pontos?: number;
    quantidade?: number;
    ativo?: boolean;
    regras?: string;
};

const BASEURL = '/estabelecimento/produtos';

export default class ProductService {
    static async getAll(page: number = 1, qty: number = 25, order = 'alfabetica', filters: any = null): Promise<any> {
        let url = `${BASEURL}?page=${page}&quantidade=${qty}&ordem=${order}`;
        if (filters && typeof filters === 'object') {
            Object.entries(filters).map((filter) => {
                url = `${url}&${filter[0]}=${filter[1]}`;
            });
        }
        const res = await httpClient.get(url);
        return res;
    }
    static async search(term: string, page: number = 1, qty: number = 25, order = 'alfabetica'): Promise<any> {
        const url = `${BASEURL}?pesquisa=${term}&page=${page}&quantidade=${qty}&ordem=${order}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async getOne(id: number | string): Promise<any> {
        const url = `${BASEURL}/${id}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async create(payload: ProductCreatePayload): Promise<any> {
        const url = BASEURL;
        const res = await httpClient.post(url, payload);
        return res;
    }
    static async update(id: string | number, payload: ProductUpdatePayload): Promise<any> {
        const url = `${BASEURL}/${id}`;
        const res = await httpClient.put(url, payload);
        return res;
    }
    static async remove(id: number | string) {
        const url = `${BASEURL}/${id}`;
        const res = await httpClient.delete(url);
    }
}
