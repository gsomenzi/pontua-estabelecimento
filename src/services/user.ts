import HttpClient from '../plugins/HttpClient';
const httpClient = new HttpClient();

/**
 * ORDERS
 * alfabetica, alfabetica-desc,
 * escolaridade, escolaridade-desc,
 * sexo, sexo-desc,
 * data_nascimento, data_nascimento-desc,
 * pontos, pontos-desc,
 * vezes, vezes-desc
 */

export default class UserService {
    static async getAll(page: number = 1, qty: number = 25, order = 'alfabetica', filters: any = null): Promise<any> {
        let url = `/estabelecimento/usuarios?page=${page}&quantidade=${qty}&ordem=${order}`;
        if (filters && typeof filters === 'object') {
            Object.entries(filters).map((filter) => {
                url = `${url}&${filter[0]}=${filter[1]}`;
            });
        }
        const res = await httpClient.get(url);
        return res;
    }
    static async search(term: string, page: number = 1, qty: number = 25, order = 'alfabetica'): Promise<any> {
        const url = `/estabelecimento/usuarios?pesquisa=${term}&page=${page}&quantidade=${qty}&ordem=${order}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async getOne(id: number | string): Promise<any> {
        const url = `/estabelecimento/usuarios/${id}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async getByCode(code: number | string): Promise<any> {
        const url = `/estabelecimento/usuarios?codigo=${code}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async remove(id: number | string) {
        const url = `/estabelecimento/usuarios/${id}`;
        const res = await httpClient.delete(url);
    }
}
