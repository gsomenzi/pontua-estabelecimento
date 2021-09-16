import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import BreadCrumbs from '../../components/atoms/BreadCrumbs';
import PageContainer from '../../components/atoms/PageContainer';
import Drawer from '../../components/molecules/Drawer';
import PageHeader from '../../components/molecules/PageHeader';
import { RootState } from '../../store';
import { getOne, update } from '../../store/slices/product';
import { getByProduct } from '../../store/slices/statistic';
import ProductsForm from '../../components/organisms/Products/Form';
import { TabInfos } from '../../components/organisms/Products/TabInfos';
import TabImages from '../../components/organisms/Products/TabImages';
import { TabDashboard } from '../../components/organisms/Products/TabDashboard';

type Props = {
    match: any;
};

export default function ProductDetails(props: Props) {
    const { match } = props;
    const { params } = match;
    const dispatch = useDispatch();
    const { getting, updating, item, error } = useSelector((state: RootState) => state.product);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    /**
     * Breadcrumbs no topo da página
     */
    const [breadCrumbItems, setBreadCrumbItems] = useState<any>([
        { title: 'Estabelecimentos', link: '/estabelecimentos' },
    ]);
    const {
        loading: loadingStatistics,
        productData,
        error: errorStatistic,
    } = useSelector((state: RootState) => state.statistic);

    useEffect(() => {
        if (params.id) {
            dispatch(getOne(params.id));
            dispatch(getByProduct(params.id));
            setBreadCrumbItems([...breadCrumbItems].concat([{ title: params.id }]));
        }
    }, [dispatch, params]);

    useEffect(() => {
        console.log('productData', productData);
    }, [productData]);

    /**
     * Abre o drawer para edição
     */
    function openEdit() {
        setOpenDrawer(true);
    }

    function submit(values: any) {
        dispatch(update({ ...values, id: item.id }));
    }

    return (
        <PageContainer padded hasSidebar>
            <BreadCrumbs items={breadCrumbItems} />
            <PageHeader
                searchable={false}
                title="Detalhes do prêmio"
                loading={getting}
                actions={[
                    <Button onClick={() => setOpenDrawer(true)} color="primary" key="edit">
                        Editar
                    </Button>,
                    <Button tag={Link} to="/estabelecimentos" key="back">
                        Voltar
                    </Button>,
                ]}
            />
            {/* BODY */}
            <div className="row">
                <div className="col-12">
                    <Nav tabs>
                        <NavItem>
                            <NavLink className={`${activeTab === 0 ? 'active' : ''}`} onClick={() => setActiveTab(0)}>
                                Dashboard
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={`${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>
                                Dados
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={`${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>
                                Imagens
                            </NavLink>
                        </NavItem>
                    </Nav>
                    {/* TABS */}
                    <div className="mt-2">
                        {item ? (
                            <TabContent activeTab={activeTab}>
                                <TabPane tabId={0}>
                                    <TabDashboard data={productData} />
                                </TabPane>
                                <TabPane tabId={1}>
                                    <TabInfos product={item} />
                                </TabPane>
                                <TabPane tabId={2}>
                                    <TabImages product={item} />
                                </TabPane>
                            </TabContent>
                        ) : null}
                    </div>
                </div>
            </div>
            <Drawer open={openDrawer} setOpen={setOpenDrawer} title="Editar produto">
                <ProductsForm loading={updating} product={item || undefined} onSubmit={submit} />
            </Drawer>
        </PageContainer>
    );
}
