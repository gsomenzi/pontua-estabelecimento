import React from 'react';
import { Table } from 'reactstrap';
import moment from 'moment';

type Props = {
    data: ProductStatisticData | null;
};

export default function LastScoresTable(props: Props) {
    const { data } = props;

    function renderUsers() {
        if (data && data.resgates && data.resgates) {
            return data.resgates.map((item, i) => {
                return (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td className="text-nowrap">{item.usuario.nome}</td>
                        <td className="text-right">
                            <strong>{moment(item.created_at).format('DD/MM/YYYY HH:mm')}</strong>
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
                <tbody>{renderUsers()}</tbody>
            </Table>
        </div>
    );
}
