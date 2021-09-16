import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    ButtonDropdown,
    ButtonGroup,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Table,
    Spinner,
    FormGroup,
    Label,
    Col,
    Row,
    Button,
    Badge,
} from 'reactstrap';
import BreadCrumbs from '../../components/atoms/BreadCrumbs';
import PageContainer from '../../components/atoms/PageContainer';
import Drawer from '../../components/molecules/Drawer';
import PageHeader from '../../components/molecules/PageHeader';
import { RootState } from '../../store';
import { getAll, search, setPage, setOrder, remove, clearErrors, update, create } from '../../store/slices/sale';
import ConfirmDialog from '../../components/molecules/ConfirmDialog';
import Pagination from '../../components/organisms/Layout/Pagination';
import SalesForm from '../../components/organisms/Sales/Form';

/**
 * Breadcrumbs no topo da página
 */
const breadCrumbItems = [{ title: 'Promoções' }];

function SaleId(props: { sale: any }) {
    const { sale } = props;
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggle = () => setTooltipOpen(!tooltipOpen);

    return (
        <div className="d-flex align-items-center">
            {sale.perfil ? (
                <div className="mr-2">
                    <img className="user-avatar" src={sale.perfil.avatar} />
                </div>
            ) : null}
            <Link to={`/promocoes/${sale.id}`}>
                <p className="mt-0 mb-0 font-weight-bold">{sale.nome}</p>
            </Link>
        </div>
    );
}

/**
 * Página de usuários do Pontua
 */
export default function Sales() {
    const [showFilters, setShowFilters] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selected, setSelected] = useState({ id: 0 });
    const [openActionDropdown, setOpenActionDropdown] = useState();
    const dispatch = useDispatch();
    const { creating, getting, removing, items, error, pagination, order, filters, updating } = useSelector(
        (state: RootState) => state.sale
    );

    /**
     * Fecha o drawer sempre que recebe os itens da tabela
     */
    useEffect(() => {
        setOpenDrawer(false);
    }, [items]);

    /**
     * Busca todos os usuários ao montar a página
     */
    useEffect(() => {
        dispatch(getAll());
    }, [dispatch, pagination.page, order, filters]);

    /**
     * Seleciona o usuário e mostra dropdown de mais do item
     * @param id ID do usuário
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
     * Seleciona um admin e abre o drawer para edição
     * @param item Promoção a ser selecionada
     */
    async function openEdit(item: any) {
        dispatch(clearErrors());
        await setSelected(item);
        setOpenDrawer(true);
    }

    /**
     * Seleciona um usuário e abre modal para confirmar a remoção
     * @param e Evento do link a ser cancelado
     * @param item Usuário a ser selecionado
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
     * Renderiza os itens na tabela de usuários
     */
    function renderItems() {
        if (items) {
            return items.map((item, i) => {
                return (
                    <tr key={i} className="align-middle">
                        {/* Index */}
                        <td className="compact">{i + 1}</td>
                        {/* NOME */}
                        <td>
                            <SaleId sale={item} />
                        </td>
                        {/* ATIVA */}
                        <td className="compact">
                            {item.ativo ? <Badge color="primary">Ativa</Badge> : <Badge color="light">Inativa</Badge>}
                        </td>
                        <td className="compact">
                            <ButtonGroup size="sm">
                                <Button tag={Link} to={`/promocoes/${item.id}`} size="sm" color="primary">
                                    {updating && selected && selected.id === item.id ? (
                                        <Spinner size="sm" />
                                    ) : (
                                        'Detalhes'
                                    )}
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
                                        <DropdownItem onClick={() => openEdit(item)}>Editar</DropdownItem>
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
                title="Promoções"
                loading={getting}
                searchPlaceholder="Pesquisar em promoções..."
                handleSearch={handleSearch}
                sortable
                sortableOptions={[
                    { value: 'alfabetica', label: 'A-z ⬇' },
                    { value: 'alfabetica-desc', label: 'A-z ⬆' },
                ]}
                handleSort={handleSort}
                hasFilter
                onFilterPress={() => setShowFilters(!showFilters)}
                actions={[
                    <Button key="add" onClick={openAdd}>
                        Adicionar
                    </Button>,
                ]}
            />
            {/* FILTROS */}
            {showFilters ? (
                <div className="p-2 mb-3 rounded border">
                    <Row className="align-items-center">
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <FormGroup></FormGroup>
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <FormGroup></FormGroup>
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <FormGroup className="d-flex align-items-center mb-0 mt-2"></FormGroup>
                        </Col>
                    </Row>
                </div>
            ) : null}
            {/* TABELA */}
            <Table bordered striped hover responsive>
                <thead>
                    <tr>
                        <th className="compact">#</th>
                        <th>Nome</th>
                        <th>Ativa</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>{renderItems()}</tbody>
            </Table>
            <Pagination data={pagination} onNavigate={(page: number) => dispatch(setPage(page))} />
            <Drawer open={openDrawer} setOpen={setOpenDrawer} title="Editar promoção">
                <SalesForm loading={creating || updating} sale={selected ? selected : undefined} onSubmit={submit} />
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
