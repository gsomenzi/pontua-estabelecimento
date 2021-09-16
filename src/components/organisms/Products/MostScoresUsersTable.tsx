import React from 'react';
import { Table } from 'reactstrap';

type Props = {
    data: ProductStatisticData | null;
};

export default function MostScoresUsersTable(props: Props) {
    const { data } = props;

    function renderUsers() {
        if (data && data.usuarios && data.usuarios) {
            return data.usuarios.map((user, i) => {
                return (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td className="text-nowrap">{user.usuario.nome}</td>
                        <td className="text-right">
                            <strong>{user.quantidade}</strong>
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
