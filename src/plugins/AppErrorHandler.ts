import axios from 'axios';

export default class AppErrorHandler {
    /**
     * Identifica o erro e formata para uso com campos pré determinados no app. Formato pode ser conferido em /src/types/AppError.d.ts
     * @param e Erro lançado por determinada ação
     * @returns Erro formatado no padrão AppError - types/AppError.d.ts
     */
    static getFormattedError(e: any): AppError {
        // CASO SEJA UM ERRO DO AXIOS E SEJA UM RETORNO DA API
        if (axios.isAxiosError(e) && e.response?.data) {
            // BUSCA ATRIBUTOS PADRAO DE ERRO DA API DO PONTUA
            const { data } = e.response;
            const fError: AppError = {
                title: data.message,
                description: data.description || '',
            };
            // BUSCA CAMPOS MSG DA VALIDAÇÃO E FILTRA UNDEFINED E VAZIOS
            if (data.errors && typeof data.errors === 'object') {
                fError.items = Object.entries(data.errors)
                    .map((entry: any) => (entry[1].length > 0 ? entry[1][0] : 'Erro não identificado'))
                    .filter((item: any) => !!item);
            }
            consoleLogError(fError);
            return fError;
        } else {
            // RETORNA UM ERRO COMUM, APENAS COM A MENSAGEM
            const fError: AppError = {
                title: e.message,
                description: '',
            };
            consoleLogError(fError);
            return fError;
        }
    }
}

function consoleLogError(fError: AppError): void {
    console.group('- AppErrorHandler disparou um erro');
    console.log(fError);
    console.groupEnd();
}
