import { AxiosResponse } from 'axios';
import HttpClient from '../plugins/HttpClient';
const httpClient = new HttpClient();

export default class StatisticService {
    static async getAll(): Promise<AxiosResponse<any>> {
        const res = await httpClient.get('/admin/estatisticas');
        return res;
    }
    static async getByEstablishment(id: number | string): Promise<AxiosResponse<any>> {
        const res = await httpClient.get(`/admin/estatisticas/${id}`);
        return res;
    }
    static async getByProduct(id: number | string): Promise<AxiosResponse<any>> {
        const res = await httpClient.get(`/admin/estatisticas-produtos/${id}`);
        return res;
    }
}
