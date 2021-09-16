import HttpClient from '../plugins/HttpClient';
const httpClient = new HttpClient();

export default class ProductImageService {
    static async getAllByProduct(idProduto: number | string): Promise<any> {
        const url = `/estabelecimento/imagens-produtos/${idProduto}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async upload(idProduto: number | string, file: any): Promise<any> {
        const url = `/estabelecimento/imagens-produtos/${idProduto}`;
        const data = new FormData();
        data.append('foto', file);
        const res = await httpClient.upload(url, data);
        return res;
    }
    static async update(id: string | number, payload: any): Promise<any> {
        const url = `/estabelecimento/imagens-produtos/${id}`;
        const res = await httpClient.put(url, payload);
        return res;
    }
    static async remove(id: number | string) {
        const url = `/estabelecimento/imagens-produtos/${id}`;
        const res = await httpClient.delete(url);
    }
}
