interface ProductStatisticData {
    cidades: any[];
    dias: any[];
    historico: {
        dia: string;
        quantidade: number;
    }[];
    produto: any;
    resgates: any[];
    resgatesHoje: number;
    totalResgates: number;
    usuarios: any[];
}
