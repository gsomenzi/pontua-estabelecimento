import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Button,
    ButtonDropdown,
    ButtonGroup,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Table,
    Spinner,
} from 'reactstrap';
import BreadCrumbs from '../components/atoms/BreadCrumbs';
import PageContainer from '../components/atoms/PageContainer';
import Drawer from '../components/molecules/Drawer';
import PageHeader from '../components/molecules/PageHeader';
import CategoriesForm from '../components/organisms/Categories/Form';
import { RootState } from '../store';
import { getAll, search, create, update, remove, setPage, clearErrors } from '../store/slices/category';
import ConfirmDialog from '../components/molecules/ConfirmDialog';
import Pagination from '../components/organisms/Layout/Pagination';

/**
 * Breadcrumbs no topo da página
 */
const breadCrumbItems = [{ title: 'Categorias' }];

/**
 * Página de categorias de estabelecimentos
 */
export default function Categories() {
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selected, setSelected] = useState({ id: 0 });
    const [openActionDropdown, setOpenActionDropdown] = useState();
    const dispatch = useDispatch();
    const { creating, getting, updating, removing, items, error, pagination } = useSelector(
        (state: RootState) => state.category
    );

    /**
     * Fecha o drawer sempre que recebe os itens da tabela
     */
    useEffect(() => {
        setOpenDrawer(false);
    }, [items]);
    /**
     * Busca todas as categorias ao montar a página
     */
    useEffect(() => {
        dispatch(getAll());
    }, [dispatch, pagination.page]);

    /**
     * Seleciona a categoria e mostra dropdown de mais do item
     * @param id ID da categoria
     */
    function handleMoreDropdown(id: any) {
        openActionDropdown === id ? setOpenActionDropdown(undefined) : setOpenActionDropdown(id);
    }

    /**
     * Dispara pesquisa ao alterar o input de pesquisa
     * @param ev Evento de alteração do input de pesquisa
     */
    function handleSearch(ev: any) {
        dispatch(search(ev.target.value));
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
     * Seleciona uma categoria e abre o drawer para edição
     * @param item Categoria a ser selecionada
     */
    async function openEdit(item: any) {
        dispatch(clearErrors());
        await setSelected(item);
        setOpenDrawer(true);
    }

    /**
     * Seleciona uma categoria e abre modal para confirmar a remoção
     * @param e Evento do link a ser cancelado
     * @param item Categoria a ser selecionada
     */
    function handleRemove(e: any, item: any) {
        e.preventDefault();
        setSelected(item);
        setShowRemoveModal(true);
    }

    function submit(values: any) {
        if (selected && selected.id) {
            dispatch(update({ ...values, id: selected.id }));
        } else {
            dispatch(create(values));
        }
    }

    /**
     * Renderiza os itens na tabela de categorias
     */
    function renderItems() {
        if (items) {
            return items.map((item, i) => {
                return (
                    <tr key={i} className="align-middle">
                        <td className="compact">{i + 1}</td>
                        <td>{item.nome}</td>
                        <td className="compact">{item.estabelecimentos_count}</td>
                        <td className="compact">
                            <ButtonGroup size="sm">
                                <Button onClick={(ev) => openEdit(item)} size="sm" color="primary">
                                    {updating && selected && selected.id === item.id ? <Spinner size="sm" /> : 'Editar'}
                                </Button>
                                <ButtonDropdown
                                    isOpen={openActionDropdown === item.id}
                                    toggle={() => handleMoreDropdown(item.id)}
                                >
                                    <DropdownToggle size="sm" color="light" caret>
                                        {removing && selected && selected.id === item.id ? (
                                            <Spinner size="sm" />
                                        ) : (
                                            'Mais'
                                        )}
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
    }

    return (
        <PageContainer padded hasSidebar>
            <BreadCrumbs items={breadCrumbItems} />
            <PageHeader
                title="Categorias"
                loading={getting}
                searchPlaceholder="Pesquisar em categorias..."
                handleSearch={handleSearch}
                actions={[
                    <Button key="add" onClick={openAdd}>
                        Adicionar
                    </Button>,
                ]}
            />
            <Table bordered striped hover responsive>
                <thead>
                    <tr>
                        <th className="compact">#</th>
                        <th>Nome</th>
                        <th>Estabelecimentos</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>{renderItems()}</tbody>
            </Table>
            <Pagination data={pagination} onNavigate={(page: number) => dispatch(setPage(page))} />
            <Drawer open={openDrawer} setOpen={setOpenDrawer} title="Editar categoria">
                <CategoriesForm
                    loading={creating || updating}
                    category={selected ? selected : undefined}
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
        </PageContainer>
    );
}
