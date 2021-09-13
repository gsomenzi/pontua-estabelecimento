import HttpClient from '../plugins/HttpClient';
const httpClient = new HttpClient();

export default class EstablishmentImageService {
    static async getAllByEstablishment(idEstabelecimento: number | string): Promise<any> {
        const url = `/admin/imagens-estabelecimentos/${idEstabelecimento}`;
        const res = await httpClient.get(url);
        return res;
    }
    static async upload(idEstabelecimento: number | string, file: any): Promise<any> {
        const url = `/admin/imagens-estabelecimentos/${idEstabelecimento}`;
        const data = new FormData();
        data.append('foto', file);
        const res = await httpClient.upload(url, data);
        return res;
    }
    // static async create(payload: any): Promise<any> {
    //     const url = '/admin/admins-estabelecimentos';
    //     const res = await httpClient.post(url, payload);
    //     return res;
    // }
    static async update(id: string | number, payload: any): Promise<any> {
        const url = `/admin/imagens-estabelecimentos/${id}`;
        const res = await httpClient.put(url, payload);
        return res;
    }
    static async remove(id: number | string) {
        const url = `/admin/imagens-estabelecimentos/${id}`;
        const res = await httpClient.delete(url);
    }
}
