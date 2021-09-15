import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink as Link } from 'react-router-dom';
import ConfirmDialog from '../../molecules/ConfirmDialog';
import { signOut } from '../../../store/slices/auth';
import { RootState } from '../../../store';

function Avatar(props: any) {
    const { userData } = props;
    return <div className="user-avatar">{userData.nome.split('')[0].toUpperCase()}</div>;
}

export default function Sidebar() {
    const dispatch = useDispatch();
    const [showExitModal, setShowExitModal] = useState(false);
    const { userData } = useSelector((state: RootState) => state.auth);

    function handleSignOut(e: any) {
        e.preventDefault();
        setShowExitModal(true);
    }

    return (
        <div id="main-sidebar">
            <div className="main-sidebar-menu">
                <div className="main-sidebar-menu-item user-data d-flex align-items-center justify-content-center">
                    <img src="/assets/imgs/logo-branco.png" />
                </div>
                {userData && userData.id ? (
                    <div className="main-sidebar-menu-item user-data d-flex align-items-center">
                        <div>
                            <Avatar userData={userData} />
                        </div>
                        <div className="user-title">
                            <h5 className="mb-0">{userData.nome.split(' ')[0]}</h5>
                            <span className="text-nowrap">{userData.email}</span>
                        </div>
                    </div>
                ) : null}
                <Link activeClassName="active" exact to="/" className="main-sidebar-menu-item">
                    <i className="bi-bar-chart sidebar-menu-item-icon"></i>
                    <span className="sidebar-menu-item-text">Dashboard</span>
                </Link>
                {/* <Link activeClassName="active" to="/categorias" className="main-sidebar-menu-item">
                    <i className="bi-bookmark sidebar-menu-item-icon"></i>
                    <span className="sidebar-menu-item-text">Categorias</span>
                </Link>
                <Link activeClassName="active" to="/estabelecimentos" className="main-sidebar-menu-item">
                    <i className="bi-shop sidebar-menu-item-icon"></i>
                    <span className="sidebar-menu-item-text">Estabelecimentos</span>
                </Link> */}
                {/* <Link activeClassName="active" to="/admins" className="main-sidebar-menu-item">
                    <i className="bi-shield sidebar-menu-item-icon"></i>
                    <span className="sidebar-menu-item-text">Administradores</span>
                </Link> */}
                <Link activeClassName="active" to="/usuarios" className="main-sidebar-menu-item">
                    <i className="bi-person sidebar-menu-item-icon"></i>
                    <span className="sidebar-menu-item-text">Usuários</span>
                </Link>
                <a href="/" onClick={handleSignOut} className="main-sidebar-menu-item">
                    <i className="bi-box-arrow-left sidebar-menu-item-icon"></i>
                    <span className="sidebar-menu-item-text">Sair</span>
                </a>
            </div>
            <ConfirmDialog show={showExitModal} setShow={setShowExitModal} onConfirm={() => dispatch(signOut())} />
        </div>
    );
}
