import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    Spinner,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Col,
    Row,
} from 'reactstrap';
import BreadCrumbs from '../components/atoms/BreadCrumbs';
import PageContainer from '../components/atoms/PageContainer';
import HistoryChart from '../components/organisms/Statistic/HistoryChart';
import EstablishmentPerCategoryChart from '../components/organisms/Statistic/EstablishmentPerCategoryChart';
import EstablishmentPerCityChart from '../components/organisms/Statistic/EstablishmentPerCityChart';
import UserPerSexChart from '../components/organisms/Statistic/UserPerSexChart';
import UserPerAgeChart from '../components/organisms/Statistic/UserPerAgeChart';
import MostScoresUsersTable from '../components/organisms/Statistic/MostScoresUsersTable';
import LessScoresUsersTable from '../components/organisms/Statistic/LessScoresUsersTable';
import TopScoresUsersTable from '../components/organisms/Statistic/TopScoresUsersTable';
import MostScoresEstablishmentsTable from '../components/organisms/Statistic/MostScoresEstablishmentsTable';
import LessScoresEstablishmentsTable from '../components/organisms/Statistic/LessScoresEstablishmentsTable';
import { RootState } from '../store';
import { getAll } from '../store/slices/statistic';
import { getAll as getUsers, setPage, setQty, setOrder } from '../store/slices/user';
import StatisticCard from '../components/molecules/StatisticCard';

export default function Home() {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('users');
    const { data, loading } = useSelector((state: RootState) => state.statistic);
    const { items: topUsers } = useSelector((state: RootState) => state.user);

    async function getData() {
        dispatch(getAll());
        await dispatch(setPage(1));
        await dispatch(setQty(10));
        await dispatch(setOrder('pontos-desc'));
        dispatch(getUsers());
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <PageContainer padded hasSidebar>
            <BreadCrumbs />
            <div className="d-flex align-items-center justify-content-between">
                <h1>Dashboard</h1>
                {loading ? <Spinner color="secondary" /> : null}
            </div>
            <hr className="mt-0" />
            {/* CARDS */}
            <div className="py-1">
                <Row>
                    <Col lg={3} md={6} sm={6} xs={6}>
                        <StatisticCard
                            title="Pontos"
                            iconName="hand-index"
                            color="primary"
                            value={`${data?.pontos?.total}`}
                            extra={`+${data?.pontos?.hoje} hoje`}
                        />
                    </Col>
                    <Col lg={3} md={6} sm={6} xs={6}>
                        <StatisticCard
                            title="Pontuações"
                            iconName="bar-chart"
                            color="secondary"
                            value={`${data?.pontuacoes?.total}`}
                            extra={`+${data?.pontuacoes?.hoje} hoje`}
                        />
                    </Col>
                    <Col lg={3} md={6} sm={6} xs={6}>
                        <StatisticCard
                            title="Resg. prêmios"
                            iconName="percent"
                            color="tertiary"
                            value={`${data?.resgates_produtos?.total}`}
                            extra={`+${data?.resgates_produtos?.hoje} hoje`}
                        />
                    </Col>
                    <Col lg={3} md={6} sm={6} xs={6}>
                        <StatisticCard
                            title="Resg. cupons"
                            iconName="tags"
                            color="primary"
                            value={`${data?.resgates_vouchers?.total}`}
                            extra={`+${data?.resgates_vouchers?.hoje} hoje`}
                        />
                    </Col>
                </Row>
            </div>
            {/* CONTEUDO PRINCIPAL */}
            <Card className="mb-3">
                <CardHeader>
                    <CardTitle>Histórico</CardTitle>
                </CardHeader>
                <CardBody>
                    <HistoryChart data={data} />
                </CardBody>
            </Card>
            {/* NAVEGAÇÃO ENTRE ABAS */}
            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={`${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Usuários
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={`${activeTab === 'establishments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('establishments')}
                    >
                        Estabelecimentos
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                {/* USUARIOS */}
                <TabPane tabId="users">
                    <div className="mt-3">
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <Card className="mb-3">
                                    <CardHeader>
                                        <CardTitle>Usuários x sexo</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <UserPerSexChart data={data} />
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="col-12 col-md-6">
                                <Card className="mb-3">
                                    <CardHeader>
                                        <CardTitle>Usuários x faixa etária</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <UserPerAgeChart data={data} />
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-lg-4">
                                <Card className="mb-3">
                                    <CardHeader>
                                        <CardTitle>
                                            <i className="bi-graph-up"></i>
                                            <span className="p-2">Usuários que mais pontuaram</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <TopScoresUsersTable users={topUsers} />
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="col-12 col-lg-4">
                                <Card className="mb-3">
                                    <CardHeader>
                                        <CardTitle>
                                            <i className="bi-hand-thumbs-up"></i>
                                            <span className="p-2">Usuários pontuaram mais vezes</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <MostScoresUsersTable data={data} />
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="col-12 col-lg-4">
                                <Card className="mb-3">
                                    <CardHeader>
                                        <CardTitle>
                                            <i className="bi-hand-thumbs-down"></i>
                                            <span className="p-2">Usuários pontuaram menos vezes</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <LessScoresUsersTable data={data} />
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                </TabPane>
                {/* ESTABELECIMENTOS */}
                <TabPane tabId="establishments">
                    <div className="mt-3">
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <Card className="mb-3">
                                    <CardHeader>
                                        <CardTitle>Estabelecimentos x categoria</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <EstablishmentPerCategoryChart data={data} />
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="col-12 col-md-6">
                                <Card className="mb-3">
                                    <CardHeader>
                                        <CardTitle>Estabelecimentos x cidade</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <EstablishmentPerCityChart data={data} />
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-lg-6">
                                <Card className="mb-3">
                                    <CardHeader>
                                        <CardTitle>
                                            <i className="bi-hand-thumbs-up"></i>
                                            <span className="p-2">Estabelecimentos pontuaram mais vezes</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <MostScoresEstablishmentsTable data={data} />
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="col-12 col-lg-6">
                                <Card className="mb-3">
                                    <CardHeader>
                                        <CardTitle>
                                            <i className="bi-hand-thumbs-down"></i>
                                            <span className="p-2">Estabelecimentos pontuaram menos vezes</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <LessScoresEstablishmentsTable data={data} />
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                </TabPane>
            </TabContent>
        </PageContainer>
    );
}
