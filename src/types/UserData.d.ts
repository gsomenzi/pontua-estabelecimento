interface UserData {
    id: number | string;
    nome: string;
    email: string;
    created_at: string;
    updated_at: string;
    funcao: {
        id: number | string;
        nome: string;
        slug: string;
        superadmin: number;
        permissoes: string[];
    };
}
