import React from 'react';
import { Table } from 'reactstrap';

type Props = {
    data: StatisticData | null;
};

export default function MostScoresUsersTable(props: Props) {
    const { data } = props;

    function renderUsers() {
        if (data && data.usuarios && data.usuarios.mais_vezes) {
            return data.usuarios.mais_vezes.map((user, i) => {
                return (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td className="text-nowrap">{user.nome}</td>
                        <td className="text-right">
                            <strong>{user.vezes}</strong>
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
