import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import BreadCrumbs from '../../components/atoms/BreadCrumbs';
import PageContainer from '../../components/atoms/PageContainer';
import Drawer from '../../components/molecules/Drawer';
import PageHeader from '../../components/molecules/PageHeader';
import EstablishmentsForm from '../../components/organisms/Establishments/Form';
import { RootState } from '../../store';
import {
    getAll,
    search,
    create,
    update,
    setPage,
    setOrder,
    remove,
    clearErrors,
} from '../../store/slices/establishment';
import ConfirmDialog from '../../components/molecules/ConfirmDialog';
import Pagination from '../../components/organisms/Layout/Pagination';

function EstablishmentType(props: any) {
    const { establishment } = props;
    switch (establishment.tipo) {
        case 'pessoa_juridica':
            return <span>PJ</span>;
        case 'pessoa_fisica':
            return <span>PF</span>;
        default:
            return <span>-</span>;
    }
}

function EstablishmentId(props: any) {
    const { establishment } = props;
    return (
        <div className="d-flex align-items-center">
            {establishment.perfil ? (
                <div className="mr-2">
                    <img className="user-avatar" src={establishment.perfil.avatar} />
                </div>
            ) : null}
            <Link to={`/estabelecimentos/${establishment.id}`}>
                <p className="mt-0 mb-0 font-weight-bold">{establishment.razao_social}</p>
                <p className="mt-0 mb-0">
                    {establishment.tipo === 'pessoa_fisica' ? establishment.cpf : establishment.cnpj}
                </p>
            </Link>
        </div>
    );
}

/**
 * Breadcrumbs no topo da página
 */
const breadCrumbItems = [{ title: 'Estabelecimentos' }];

/**
 * Página de estabelecimentos do Pontua
 */
export default function Establishments() {
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selected, setSelected] = useState({ id: 0 });
    const [openActionDropdown, setOpenActionDropdown] = useState();
    const dispatch = useDispatch();
    const { creating, updating, getting, removing, items, error, pagination, order } = useSelector(
        (state: RootState) => state.establishment
    );

    /**
     * Fecha o drawer sempre que recebe os itens da tabela
     */
    useEffect(() => {
        setOpenDrawer(false);
    }, [items]);
    /**
     * Busca todos os estabelecimentos ao montar a página
     */
    useEffect(() => {
        dispatch(getAll());
    }, [dispatch, pagination.page, order]);

    /**
     * Seleciona o estabelecimento e mostra dropdown de mais do item
     * @param id ID do estabelecimento
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
     * Dispara ordenação ao alterar o select no header
     * @param ev Evento de alteração do selec de ordem
     */
    function handleSort(ev: any) {
        dispatch(setOrder(ev.target.value));
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
        if (selected && selected.id) {
            dispatch(update({ ...values, id: selected.id }));
        } else {
            dispatch(create(values));
        }
    }

    /**
     * Renderiza os itens na tabela de estabelecimentos
     */
    function renderItems() {
        if (items) {
            return items.map((item, i) => {
                return (
                    <tr key={i} className="align-middle">
                        {/* Index */}
                        <td className="compact">{i + 1}</td>
                        {/* NOME e EMAIL */}
                        <td>
                            <EstablishmentId establishment={item} />
                        </td>
                        <td className="compact">
                            <EstablishmentType establishment={item} />
                        </td>
                        <td className="compact">
                            {item.cidade || '-'}/{item.estado || '-'}
                        </td>
                        <td className="compact">{item.categoria ? item.categoria.nome : '-'}</td>
                        <td className="compact">{item.qtde_usuarios || '0'}</td>
                        <td className="compact">{item.pontos}</td>
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
                title="Estabelecimentos"
                loading={getting}
                searchPlaceholder="Pesquisar em estabelecimentos..."
                handleSearch={handleSearch}
                sortable
                sortableOptions={[
                    { value: 'razao_social', label: 'A-z ⬇' },
                    { value: 'razao_social-desc', label: 'A-z ⬆' },
                    { value: 'cidade', label: 'Cidade ⬇' },
                    { value: 'cidade-desc', label: 'Cidade ⬆' },
                    { value: 'pontos', label: 'Pontos ⬆' },
                    { value: 'pontos-desc', label: 'Pontos ⬇' },
                ]}
                handleSort={handleSort}
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
                        <th>Tipo</th>
                        <th>Cidade/UF</th>
                        <th>Categoria</th>
                        <th>Usuários</th>
                        <th>Pontos</th>
                        <th className="text-right">Ações</th>
                    </tr>
                </thead>
                <tbody>{renderItems()}</tbody>
            </Table>
            <Pagination data={pagination} onNavigate={(page: number) => dispatch(setPage(page))} />
            <Drawer open={openDrawer} setOpen={setOpenDrawer} title="Editar estabelecimento">
                <EstablishmentsForm
                    loading={creating || updating}
                    establishment={selected ? selected : undefined}
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
