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
        let url = `/admin/usuarios?page=${page}&quantidade=${qty}&ordem=${order}`;
        if (filters && typeof filters === 'object') {
            Object.entries(filters).map((filter) => {
                url = `${url}&${filter[0]}=${filter[1]}`;
            });
        }
        console.log(url);
        const res = await httpClient.get(url);
        return res;
    }
    static async search(term: string, page: number = 1, qty: number = 25, order = 'alfabetica'): Promise<any> {
        const url = `/admin/usuarios?pesquisa=${term}&page=${page}&quantidade=${qty}&ordem=${order}`;
        // await httpClient.cancelRequest();
        const res = await httpClient.get(url);
        return res;
    }
    static async getOne(id: number | string): Promise<any> {
        const url = `/admin/usuarios/${id}`;
        const res = await httpClient.get(url);
        return res;
    }
    // static async update(id: string | number, payload: CategoryUpdatePayload): Promise<any> {
    //     const url = `/admin/usuarios/${id}`;
    //     const res = await httpClient.put(url, payload);
    //     return res;
    // }
    static async remove(id: number | string) {
        const url = `/admin/usuarios/${id}`;
        const res = await httpClient.delete(url);
    }
}
