import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllByEstablishment, create, update, remove, clearErrors } from '../../../store/slices/establishmentAdmin';
import { RootState } from '../../../store';
import {
    Button,
    ButtonDropdown,
    ButtonGroup,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Spinner,
    Table,
} from 'reactstrap';
import ConfirmDialog from '../../molecules/ConfirmDialog';
import EstablishmentAdminsForm from '../EstablishmentAdmins/Form';
import Drawer from '../../molecules/Drawer';

/**
 * Avatar, nome e email do admin
 * @param props
 * @returns
 */
function AdminId(props: any) {
    const { admin } = props;
    return (
        <div className="d-flex align-items-center">
            {admin.perfil ? (
                <div className="mr-2">
                    <img className="user-avatar" src={admin.perfil.avatar} />
                </div>
            ) : null}
            <div>
                <p className="mt-0 mb-0 font-weight-bold">{admin.nome}</p>
                <p className="mt-0 mb-0">{admin.email}</p>
            </div>
        </div>
    );
}

type Props = {
    establishment: any;
};

export default function TabAdmins(props: Props) {
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selected, setSelected] = useState({ id: 0 });
    const [openActionDropdown, setOpenActionDropdown] = useState();
    const dispatch = useDispatch();
    const { establishment } = props;
    const { creating, getting, updating, removing, error, items } = useSelector(
        (state: RootState) => state.establishmentAdmin
    );
    /**
     * Fecha o drawer sempre que recebe os itens da tabela
     */
    useEffect(() => {
        setOpenDrawer(false);
    }, [items]);
    /**
     * Busca todos os admins do estabelecimento
     */
    useEffect(() => {
        if (establishment) {
            dispatch(getAllByEstablishment(establishment.id));
        }
    }, [establishment]);
    /**
     * Seleciona o estabelecimento e mostra dropdown de mais do item
     * @param id ID do estabelecimento
     */
    function handleMoreDropdown(id: any) {
        openActionDropdown === id ? setOpenActionDropdown(undefined) : setOpenActionDropdown(id);
    }
    /**
     * Desmarca item selecionado e abre o drawer
     */
    async function openAdd() {
        dispatch(clearErrors());
        await setSelected({ id: 0 });
        setOpenDrawer(true);
    }
    /**
     * Seleciona um estabelecimento e abre o drawer para edição
     * @param item Estabelecimento a ser selecionado
     */
    async function openEdit(item: any) {
        dispatch(clearErrors());
        await setSelected(item);
        setOpenDrawer(true);
    }
    /**
     * Seleciona um estabelecimento e abre modal para confirmar a remoção
     * @param e Evento do link a ser cancelado
     * @param item Estabelecimento a ser selecionado
     */
    function handleRemove(e: any, item: any) {
        e.preventDefault();
        setSelected(item);
        setShowRemoveModal(true);
    }

    function submit(values: any) {
        console.log({ ...values, estabelecimentos_id: establishment.id });
        if (selected && selected.id) {
            dispatch(
                update({
                    ...values,
                    estabelecimentos_id: establishment.id,
                    funcoes_estabelecimentos_id: 1,
                    id: selected.id,
                })
            );
        } else {
            dispatch(create({ ...values, estabelecimentos_id: establishment.id, funcoes_estabelecimentos_id: 1 }));
        }
    }
    /**
     * Renderiza itens da tabela
     */
    function renderItems() {
        return items.map((item, i) => {
            return (
                <tr className="align-middle" key={item.id}>
                    <td>{i + 1}</td>
                    <td>
                        <AdminId admin={item} />
                    </td>
                    <td className="text-right">
                        <ButtonGroup size="sm">
                            <Button onClick={(ev) => openEdit(item)} size="sm" color="primary">
                                {updating && selected && selected.id === item.id ? <Spinner size="sm" /> : 'Editar'}
                            </Button>
                            <ButtonDropdown
                                isOpen={openActionDropdown === item.id}
                                toggle={() => handleMoreDropdown(item.id)}
                            >
                                <DropdownToggle size="sm" color="light" caret>
                                    {removing && selected && selected.id === item.id ? <Spinner size="sm" /> : 'Mais'}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={(ev) => handleRemove(ev, item)}>Remover</DropdownItem>
                                </DropdownMenu>
                            </ButtonDropdown>
                        </ButtonGroup>
                    </td>
                </tr>
            );
        });
    }
    return (
        <div>
            <div className="d-flex align-items-center pb-2">
                <Button className="mr-1" onClick={openAdd}>
                    Adicionar
                </Button>
                {getting ? <Spinner /> : null}
            </div>
            <Table bordered striped>
                <thead>
                    <tr>
                        <th className="compact">#</th>
                        <th>Nome</th>
                        <th className="text-right">Ações</th>
                    </tr>
                </thead>
                <tbody>{renderItems()}</tbody>
            </Table>
            <Drawer open={openDrawer} setOpen={setOpenDrawer} title="Editar admin">
                <EstablishmentAdminsForm
                    loading={creating || updating}
                    admin={selected ? selected : undefined}
                    onSubmit={submit}
                />
            </Drawer>
            <ConfirmDialog
                title="Remover o item?"
                text="Você tem certeza que deseja remover este item?"
                show={showRemoveModal}
                setShow={setShowRemoveModal}
                onConfirm={() => dispatch(remove(selected.id))}
            />
        </div>
    );
}
