interface EstablishmentStatisticData {
    pontuacoes: {
        hoje: number;
        total: number;
    };
    pontos: {
        hoje: number;
        total: number;
    };
    produtos: {
        ativos: number;
    };
    resgates_produtos: {
        hoje: number;
        total: number;
    };
    resgates_vouchers: {
        hoje: number;
        total: number;
    };
    historicoMensal: {
        data: string;
        pontos: number;
        produtos: number;
        usuarios: number;
    }[];
    usuarios: {
        hoje: number;
        total: number;
        top: any[];
        mais_vezes: any[];
        menos_vezes: any[];
        por_faixa_etaria: any[];
        por_sexo: any[];
    };
}
