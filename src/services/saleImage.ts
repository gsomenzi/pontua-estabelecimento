import HttpClient from '../plugins/HttpClient';
const httpClient = new HttpClient();

export default class SaleImageService {
    static async getAllBySale(saleId: number | string): Promise<any> {
        const url = `/estabelecimento/imagens-promocoes/${saleId}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async upload(saleId: number | string, file: any): Promise<any> {
        const url = `/estabelecimento/imagens-promocoes/${saleId}`;
        const data = new FormData();
        data.append('foto', file);
        const res = await httpClient.upload(url, data);
        return res;
    }
    static async update(id: string | number, payload: any): Promise<any> {
        const url = `/estabelecimento/imagens-promocoes/${id}`;
        const res = await httpClient.put(url, payload);
        return res;
    }
    static async remove(id: number | string) {
        const url = `/estabelecimento/imagens-promocoes/${id}`;
        const res = await httpClient.delete(url);
    }
}
