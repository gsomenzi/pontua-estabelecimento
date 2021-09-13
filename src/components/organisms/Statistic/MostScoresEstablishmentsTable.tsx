import React from 'react';
import { Table } from 'reactstrap';

type Props = {
    data: StatisticData | null;
};

export default function MostScoresEstablishmentsTable(props: Props) {
    const { data } = props;

    function renderEstablishments() {
        if (data && data.estabelecimentos && data.estabelecimentos.mais_vezes) {
            return data.estabelecimentos.mais_vezes.map((estabelecimento, i) => {
                return (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td className="text-nowrap">{estabelecimento.razao_social}</td>
                        <td className="text-right">
                            <strong>{estabelecimento.vezes}</strong>
                        </td>
                    </tr>
                );
            });
        }
    }

    return (
        <div>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th className="text-right">Vezes</th>
                    </tr>
                </thead>
                <tbody>{renderEstablishments()}</tbody>
            </Table>
        </div>
    );
}
