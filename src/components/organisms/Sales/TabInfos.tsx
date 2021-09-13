import React from 'react';
import { Table } from 'reactstrap';
import moment from 'moment';

type Props = {
    product: any;
};

const FIELDS_BLACKLIST: string[] = [
    'id',
    'perfil',
    'estabelecimentos_id',
    'deleted_at',
    'capa',
    'imagens',
    'updated_at',
];

const HEADERS_TRANSLATION: any = {
    nome: 'Nome',
    descricao: 'Descrição',
    tipo_pontuacao: 'Tipo da pontuação',
    created_at: 'Cadastrado em',
    ativo: 'Ativo',
};

const VALUES_TRANSLATION: any = {
    estabelecimento: (value: any) => value.nome_fantasia,
    tipo_pontuacao: (value: any) => (value === 'pontos' ? 'Pontos' : 'Quantidade'),
    created_at: (value: any) => moment(value).format('DD/MM/YYYY'),
    ativo: (value: any) => (value ? 'Ativo' : 'Inativo'),
};

export function TabInfos(props: Props) {
    const { product } = props;
    function renderLines() {
        return Object.keys(product).map((key) => {
            if (FIELDS_BLACKLIST.indexOf(key) < 0) {
                return (
                    <tr key={key}>
                        <td className="compact">
                            <span className="text-bold">
                                {`${HEADERS_TRANSLATION[key] || key}`.charAt(0).toUpperCase() +
                                    `${HEADERS_TRANSLATION[key] || key}`.slice(1)}
                            </span>
                        </td>
                        <td>{VALUES_TRANSLATION[key] ? VALUES_TRANSLATION[key](product[key]) : product[key]}</td>
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
