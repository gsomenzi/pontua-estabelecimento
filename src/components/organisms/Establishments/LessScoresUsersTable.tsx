import React from 'react';
import { Table } from 'reactstrap';

type Props = {
    data: EstablishmentStatisticData | null;
};

export default function LessScoresUsersTable(props: Props) {
    const { data } = props;

    function renderUsers() {
        if (data && data.usuarios && data.usuarios.menos_vezes) {
            return data.usuarios.menos_vezes.map((user, i) => {
                return (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td className="text-nowrap">{user.nome}</td>
                        <td className="text-right">
                            <strong>{user.vezes || 0}</strong>
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
