/**
 * Normaliza objetos complexos para JSON
 * @param object Objeto a ser normalizado
 * @returns JSON formatado
 */
export function normalizeJson(object: any) {
    if (!object) return null;
    return JSON.parse(JSON.stringify(object));
}

/**
 * Filtra objeto retornando apenas atributos confiáveis
 * @param trustedFieldNames Array com strings - nomes dos atributos
 * @param object Objeto a ser filtrado
 */
export function parseTrustedFields(trustedFieldNames: string[], object: any): any {
    const trustedObject: any = {};
    Object.keys(object).map((key) => {
        if (trustedFieldNames.indexOf(key) > -1) {
            trustedObject[key] = object[key];
        }
    });
    return trustedObject;
}
