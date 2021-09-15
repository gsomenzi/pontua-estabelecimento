import { AxiosResponse } from 'axios';
import HttpClient from '../plugins/HttpClient';
const httpClient = new HttpClient();

export default class StatisticService {
    static async getAll(): Promise<AxiosResponse<any>> {
        const res = await httpClient.get('/estabelecimento/estatisticas');
        return res;
    }
    static async getByProduct(id: number | string): Promise<AxiosResponse<any>> {
        const res = await httpClient.get(`/estabelecimento/estatisticas-produtos/${id}`);
        return res;
    }
}
