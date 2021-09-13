import React from 'react';
import { Table } from 'reactstrap';

type Props = {
    data: EstablishmentStatisticData | null;
};

export default function TopScoresUsersTable(props: Props) {
    const { data } = props;

    function renderUsers() {
        if (data && data.usuarios && data.usuarios.top && data.usuarios.top.length) {
            return data.usuarios.top.map((user, i) => {
                return (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td className="text-nowrap">{user.nome}</td>
                        <td className="text-right">
                            <strong>{user.pontos}</strong>
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
                        <th className="text-right">Pontos</th>
                    </tr>
                </thead>
                <tbody>{renderUsers()}</tbody>
            </Table>
        </div>
    );
}
