import axios from 'axios';

type AddressData = {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
};

export default class CepService {
    static async getDataByCep(cep: string) {
        if (!cep) return null;
        const finalCep = cep.replace(/-/g, '').trim();
        if (finalCep.length !== 8) return null;
        try {
            const data = await axios({
                url: `https://viacep.com.br/ws/${cep}/json/`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return data.data;
        } catch (e) {
            return null;
        }
    }
}
