import HttpClient from '../plugins/HttpClient';
const httpClient = new HttpClient();

type ScoreCreatePayload = {
    users_id: number;
    quantidade: number;
    pontos: number;
    mensagem?: string;
};

export default class UserService {
    static async create(payload: ScoreCreatePayload): Promise<any> {
        const url = '/estabelecimento/pontuacoes';
        const res = await httpClient.post(url, payload);
        return res;
    }
    static async getAll(page: number = 1, qty: number = 25, order = 'alfabetica', filters: any = null): Promise<any> {
        let url = `/estabelecimento/pontuacoes?page=${page}&quantidade=${qty}&ordem=${order}`;
        if (filters && typeof filters === 'object') {
            Object.entries(filters).map((filter) => {
                url = `${url}&${filter[0]}=${filter[1]}`;
            });
        }
        const res = await httpClient.get(url);
        return res;
    }
    static async remove(id: number | string) {
        const url = `/estabelecimento/pontuacoes/${id}`;
        const res = await httpClient.delete(url);
    }
}
