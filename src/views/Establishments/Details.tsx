import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import BreadCrumbs from '../../components/atoms/BreadCrumbs';
import PageContainer from '../../components/atoms/PageContainer';
import PageHeader from '../../components/molecules/PageHeader';
import { RootState } from '../../store';
import { getOne } from '../../store/slices/establishment';
import { getByEstablishment } from '../../store/slices/statistic';
import { TabDashboard } from '../../components/organisms/Establishments/TabDashboard';
import { TabInfos } from '../../components/organisms/Establishments/TabInfos';
import TabAdmins from '../../components/organisms/Establishments/TabAdmins';
import TabImages from '../../components/organisms/Establishments/TabImages';
import TabProducts from '../../components/organisms/Establishments/TabProducts';
import TabSales from '../../components/organisms/Establishments/TabSales';

type Props = {
    match: any;
};

/**
 * Breadcrumbs no topo da página
 */
const breadCrumbItems = [{ title: 'Estabelecimentos' }];

export default function EstablishmentDetails(props: Props) {
    const { match } = props;
    const { params } = match;
    const dispatch = useDispatch();
    const { getting, item, error } = useSelector((state: RootState) => state.establishment);
    const {
        loading: loadingStatistics,
        establishmentData,
        error: errorStatistic,
    } = useSelector((state: RootState) => state.statistic);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        dispatch(getOne(params.id));
        dispatch(getByEstablishment(params.id));
    }, [dispatch, params]);

    return (
        <PageContainer padded hasSidebar>
            <BreadCrumbs items={breadCrumbItems} />
            <PageHeader
                searchable={false}
                title="Detalhes do estabelecimento"
                loading={getting || loadingStatistics}
                actions={[
                    <Button tag={Link} to="/estabelecimentos" key="back">
                        Voltar
                    </Button>,
                ]}
            />
            {/* BODY */}
            {item ? (
                <div className="row">
                    <div className="col-12">
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={`${activeTab === 0 ? 'active' : ''}`}
                                    onClick={() => setActiveTab(0)}
                                >
                                    Dashboard
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={`${activeTab === 1 ? 'active' : ''}`}
                                    onClick={() => setActiveTab(1)}
                                >
                                    Dados
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={`${activeTab === 2 ? 'active' : ''}`}
                                    onClick={() => setActiveTab(2)}
                                >
                                    Imagens
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={`${activeTab === 3 ? 'active' : ''}`}
                                    onClick={() => setActiveTab(3)}
                                >
                                    Admins
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={`${activeTab === 4 ? 'active' : ''}`}
                                    onClick={() => setActiveTab(4)}
                                >
                                    Prêmios
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={`${activeTab === 5 ? 'active' : ''}`}
                                    onClick={() => setActiveTab(5)}
                                >
                                    Promoções
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={`${activeTab === 6 ? 'active' : ''}`}
                                    onClick={() => setActiveTab(6)}
                                >
                                    Cupons
                                </NavLink>
                            </NavItem>
                        </Nav>
                        {/* TABS */}
                        <div className="mt-2">
                            <TabContent activeTab={activeTab}>
                                <TabPane tabId={0}>
                                    <TabDashboard data={establishmentData} />
                                </TabPane>
                                <TabPane tabId={1}>
                                    <TabInfos establishment={item} />
                                </TabPane>
                                <TabPane tabId={2}>
                                    <TabImages establishment={item} />
                                </TabPane>
                                <TabPane tabId={3}>
                                    <TabAdmins establishment={item} />
                                </TabPane>
                                <TabPane tabId={4}>
                                    <TabProducts establishment={item} />
                                </TabPane>
                                <TabPane tabId={5}>
                                    <TabSales establishment={item} />
                                </TabPane>
                            </TabContent>
                        </div>
                    </div>
                </div>
            ) : null}
        </PageContainer>
    );
}
