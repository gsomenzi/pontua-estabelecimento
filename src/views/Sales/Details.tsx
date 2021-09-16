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
import { getOne, update } from '../../store/slices/sale';
import SalesForm from '../../components/organisms/Sales/Form';
import TabInfos from '../../components/organisms/Sales/TabInfos';
import TabImages from '../../components/organisms/Sales/TabImages';

type Props = {
    match: any;
};

export default function SaleDetails(props: Props) {
    const { match } = props;
    const { params } = match;
    const dispatch = useDispatch();
    const { getting, updating, item, error } = useSelector((state: RootState) => state.sale);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    /**
     * Breadcrumbs no topo da página
     */
    const [breadCrumbItems, setBreadCrumbItems] = useState<any>([{ title: 'Promoções', link: '/promocoes' }]);

    useEffect(() => {
        if (params.id) {
            dispatch(getOne(params.id));
            setBreadCrumbItems([...breadCrumbItems].concat([{ title: params.id }]));
        }
    }, [dispatch, params]);

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
                title="Detalhes da promoção"
                loading={getting}
                actions={[
                    <Button onClick={() => setOpenDrawer(true)} color="primary" key="edit">
                        Editar
                    </Button>,
                    <Button tag={Link} to="/promocoes" key="back">
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
                                Dados
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={`${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>
                                Imagens
                            </NavLink>
                        </NavItem>
                    </Nav>
                    {/* TABS */}
                    <div className="mt-2">
                        {item ? (
                            <TabContent activeTab={activeTab}>
                                <TabPane tabId={0}>
                                    <TabInfos sale={item} />
                                </TabPane>
                                <TabPane tabId={1}>
                                    <TabImages sale={item} />
                                </TabPane>
                            </TabContent>
                        ) : null}
                    </div>
                </div>
            </div>
            <Drawer open={openDrawer} setOpen={setOpenDrawer} title="Editar produto">
                <SalesForm loading={updating} sale={item || undefined} onSubmit={submit} />
            </Drawer>
        </PageContainer>
    );
}
