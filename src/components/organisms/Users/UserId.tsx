import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'reactstrap';

export default function UserId(props: { user: any }) {
    const { user } = props;
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggle = () => setTooltipOpen(!tooltipOpen);
    return (
        <div className="d-flex align-items-center mb-3">
            {user.perfil ? (
                <div className="mr-2">
                    <img className="user-avatar" src={user.perfil.avatar} />
                </div>
            ) : (
                <div className="mr-2">
                    <img className="user-avatar" src="assets/imgs/user_placeholder.png" />
                </div>
            )}
            <Link to={`/usuarios/${user.id}`}>
                <p className="mt-0 mb-0 font-weight-bold">
                    {user.nome}
                    {user.aniversariante ? (
                        <>
                            <i id={`birthdayIcon${user.id}`} className="bi bi-gift text-secondary ml-1"></i>
                            <Tooltip
                                placement="right"
                                isOpen={tooltipOpen}
                                target={`birthdayIcon${user.id}`}
                                toggle={toggle}
                            >
                                Aniversariante
                            </Tooltip>
                        </>
                    ) : null}
                </p>
                <p className="mt-0 mb-0">
                    {user.cidade} / {user.estado}
                </p>
            </Link>
        </div>
    );
}
