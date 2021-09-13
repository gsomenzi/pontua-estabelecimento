import React from 'react';
import { Table } from 'reactstrap';

type Props = {
    users: any[];
};

export default function TopScoresUsersTable(props: Props) {
    const { users } = props;

    function renderUsers() {
        if (users && users.length) {
            return users.map((user, i) => {
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
