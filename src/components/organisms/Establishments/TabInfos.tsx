import React from 'react';
import { Table } from 'reactstrap';
import moment from 'moment';

type Props = {
    establishment: any;
};

const FIELDS_BLACKLIST = [
    'id',
    'categorias_id',
    'deleted_at',
    'updated_at',
    'perfil',
    'capa',
    'qtde_usuarios',
    'produtos',
    'admins',
    'imagens',
    'promocoes',
    'vouchers',
];

const HEADERS_TRANSLATION: any = {
    razao_social: 'Razão social',
    nome_fantasia: 'Nome fantasia',
    cpf: 'CPF',
    cnpj: 'CNPJ',
    email: 'E-mail',
    whatsapp: 'WhatsApp',
    created_at: 'Cadastrado em',
    dias_expiracao_pontos: 'Tempo de expiração dos pontos',
};

const VALUES_TRANSLATION: any = {
    tipo: (value: any) => (value === 'pessoa_fisica' ? 'Pessoa física' : 'Pessoa jurídica'),
    created_at: (value: any) => moment(value).format('DD/MM/YYYY'),
    categoria: (value: any) => (value ? value.nome : '-'),
    status: (value: any) => value.charAt(0).toUpperCase() + value.slice(1),
    regras: (value: any) => (value ? value.replace(/<[^>]*>?/gm, '') : ''),
};

export function TabInfos(props: Props) {
    const { establishment } = props;
    function renderLines() {
        return Object.keys(establishment).map((key) => {
            if (FIELDS_BLACKLIST.indexOf(key) < 0) {
                return (
                    <tr key={key}>
                        <td className="compact">
                            <span className="text-bold">
                                {`${HEADERS_TRANSLATION[key] || key}`.charAt(0).toUpperCase() +
                                    `${HEADERS_TRANSLATION[key] || key}`.slice(1)}
                            </span>
                        </td>
                        <td>
                            {VALUES_TRANSLATION[key] ? VALUES_TRANSLATION[key](establishment[key]) : establishment[key]}
                        </td>
                    </tr>
                );
            }
        });
    }
    return (
        <div>
            <Table bordered striped>
                <tbody>{renderLines()}</tbody>
            </Table>
        </div>
    );
}
