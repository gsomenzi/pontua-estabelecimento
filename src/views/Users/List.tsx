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
    Tooltip,
    Input,
} from 'reactstrap';
import BreadCrumbs from '../../components/atoms/BreadCrumbs';
import PageContainer from '../../components/atoms/PageContainer';
import Drawer from '../../components/molecules/Drawer';
import PageHeader from '../../components/molecules/PageHeader';
import { RootState } from '../../store';
import { getAll, search, setPage, setOrder, remove, setFilters } from '../../store/slices/user';
import ConfirmDialog from '../../components/molecules/ConfirmDialog';
import Pagination from '../../components/organisms/Layout/Pagination';
import Select from 'react-select';

const genreOptions = [
    { value: 'masculino', label: 'Masculino' },
    { value: 'feminino', label: 'Feminino' },
    { value: 'outro', label: 'Outro' },
];

const scholarityOptions = [
    { value: 'ensino-fundamental-incompleto', label: 'Ensino fundamental incompleto' },
    { value: 'ensino-fundamental', label: 'Ensino fundamental' },
    { value: 'ensino-medio-incompleto', label: 'Ensino médio incompleto' },
    { value: 'ensino-medio', label: 'Ensino médio' },
    { value: 'ensino-superior-incompleto', label: 'Ensino superior incompleto' },
    { value: 'ensino-superior', label: 'Ensino superior' },
];

/**
 * Breadcrumbs no topo da página
 */
const breadCrumbItems = [{ title: 'Usuários' }];

function UserId(props: { user: any }) {
    const { user } = props;
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggle = () => setTooltipOpen(!tooltipOpen);

    return (
        <div className="d-flex align-items-center">
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
                <p className="mt-0 mb-0">{user.email}</p>
            </Link>
        </div>
    );
}

/**
 * Página de usuários do Pontua
 */
export default function Users() {
    const [showFilters, setShowFilters] = useState(false);
    const [genreFilter, setGenreFilter] = useState<any>(null);
    const [birthdayFilter, setBirthdayFilter] = useState(false);
    const [scholarityFilter, setScholarityFilter] = useState<any>(null);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selected, setSelected] = useState({ id: 0 });
    const [openActionDropdown, setOpenActionDropdown] = useState();
    const dispatch = useDispatch();
    const { getting, removing, items, error, pagination, order, filters } = useSelector(
        (state: RootState) => state.user
    );

    /**
     * Busca todos os usuários ao montar a página
     */
    useEffect(() => {
        dispatch(getAll());
    }, [dispatch, pagination.page, order, filters]);

    /**
     * Ao alterar select de filtros, altera filtros no state
     */
    useEffect(() => {
        if (genreFilter || scholarityFilter || birthdayFilter) {
            const f: any = {};
            if (genreFilter) f.sexo = genreFilter.value;
            if (scholarityFilter) f.escolaridade = scholarityFilter.value;
            if (birthdayFilter) f.aniversariante = true;
            dispatch(setFilters(f));
        } else {
            dispatch(setFilters(null));
        }
    }, [scholarityFilter, genreFilter, birthdayFilter]);

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
     * Seleciona um usuário e abre modal para confirmar a remoção
     * @param e Evento do link a ser cancelado
     * @param item Usuário a ser selecionado
     */
    function handleRemove(e: any, item: any) {
        e.preventDefault();
        setSelected(item);
        setShowRemoveModal(true);
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
                        {/* NOME e EMAIL */}
                        <td>
                            <UserId user={item} />
                        </td>
                        {/* SEXO */}
                        <td className="compact">{item.nome_sexo || 'Não informado'}</td>
                        {/* ESCOLARIDADE */}
                        <td className="compact">{item.nome_escolaridade || 'Não informado'}</td>
                        {/* PONTOS */}
                        <td className="compact">{item.pontos || '0'}</td>
                        <td className="compact">
                            <ButtonGroup size="sm">
                                {/* <Button onClick={(ev) => openEdit(item)} size="sm" color="primary">
                                    {updating && selected && selected.id === item.id ? <Spinner size="sm" /> : 'Editar'}
                                </Button> */}
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
                title="Usuários"
                loading={getting}
                searchPlaceholder="Pesquisar em usuários..."
                handleSearch={handleSearch}
                sortable
                sortableOptions={[
                    { value: 'alfabetica', label: 'A-z ⬇' },
                    { value: 'alfabetica-desc', label: 'A-z ⬆' },
                    { value: 'sexo', label: 'Sexo ⬆' },
                    { value: 'sexo-desc', label: 'Sexo ⬇' },
                    { value: 'escolaridade', label: 'Escol. ⬆' },
                    { value: 'escolaridade-desc', label: 'Escol. ⬇' },
                    { value: 'pontos', label: 'Pontos ⬆' },
                    { value: 'pontos-desc', label: 'Pontos ⬇' },
                ]}
                handleSort={handleSort}
                hasFilter
                onFilterPress={() => setShowFilters(!showFilters)}
            />
            {/* FILTROS */}
            {showFilters ? (
                <div className="p-2 mb-3 rounded border">
                    <Row className="align-items-center">
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <FormGroup>
                                <Label>Sexo</Label>
                                <Select
                                    isClearable
                                    options={genreOptions}
                                    onChange={setGenreFilter}
                                    placeholder="Selecione..."
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <FormGroup>
                                <Label>Escolaridade</Label>
                                <Select
                                    isClearable
                                    options={scholarityOptions}
                                    onChange={setScholarityFilter}
                                    placeholder="Selecione..."
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <FormGroup className="d-flex align-items-center mb-0 mt-2">
                                <Label check>
                                    <Input type="checkbox" onChange={(e) => setBirthdayFilter(e.target.checked)} />{' '}
                                    Apenas aniversariantes
                                </Label>
                            </FormGroup>
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
                        <th>Sexo</th>
                        <th>Escolaridade</th>
                        <th>Pontos</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>{renderItems()}</tbody>
            </Table>
            <Pagination data={pagination} onNavigate={(page: number) => dispatch(setPage(page))} />
            <Drawer open={openDrawer} setOpen={setOpenDrawer} title="Editar usuário"></Drawer>
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
