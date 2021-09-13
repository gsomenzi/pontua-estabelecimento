import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, Table, Badge } from 'reactstrap';
import BreadCrumbs from '../../components/atoms/BreadCrumbs';
import PageContainer from '../../components/atoms/PageContainer';
import PageHeader from '../../components/molecules/PageHeader';
import { RootState } from '../../store';
import { getOne } from '../../store/slices/user';
import moment from 'moment';
import 'moment/locale/pt-br';

type Props = {
    match: any;
};

/**
 * Breadcrumbs no topo da página
 */
const breadCrumbItems = [{ title: 'Usuários' }];

export default function UserDetails(props: Props) {
    const { match } = props;
    const { params } = match;
    const dispatch = useDispatch();
    const { getting, removing, item, error, pagination } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        console.log(item);
    }, [item]);

    useEffect(() => {
        dispatch(getOne(params.id));
    }, [dispatch, params]);

    function renderScores() {
        return item.pontuacoes.map((pontuacao: any, i: number) => {
            return (
                <tr key={pontuacao.id} className="align-middle">
                    <td>{i + 1}</td>
                    <td>{moment(pontuacao.created_at).format('DD/MM/YYYY')}</td>
                    <td>
                        <p className="font-weight-bold mb-0">{pontuacao.estabelecimento.nome_fantasia}</p>
                        <p className="mb-0">
                            {pontuacao.estabelecimento.cidade}/{pontuacao.estabelecimento.estado}
                        </p>
                    </td>
                    <td className="text-right font-weight-bold">{pontuacao.pontos}</td>
                </tr>
            );
        });
    }

    return (
        <PageContainer padded hasSidebar>
            <BreadCrumbs items={breadCrumbItems} />
            <PageHeader
                searchable={false}
                title="Detalhes do usuário"
                loading={getting}
                actions={[
                    <Button tag={Link} to="/usuarios" key="back">
                        Voltar
                    </Button>,
                ]}
            />
            {/* BODY */}
            {item ? (
                <div className="row">
                    <div className="col-12 col-md-4">
                        <Card>
                            <CardBody className="text-center">
                                <img src={item.perfil ? item.perfil.avatar : ''} className="user-avatar-large mb-3" />
                                <h4 className="mb-0">{item.nome}</h4>
                                <p>{item.email}</p>
                                <div>
                                    <h4 className="mb-0">
                                        <Badge>{item.pontos}</Badge>
                                    </h4>
                                    <p>Pontos</p>
                                </div>
                                <Table className="text-left">
                                    <tbody>
                                        <tr>
                                            <td>Local</td>
                                            <td className="text-right font-weight-bold">
                                                {item.cidade}/{item.estado}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Idade</td>
                                            <td className="text-right font-weight-bold">
                                                {item.data_nascimento
                                                    ? moment(item.data_nascimento).fromNow(true)
                                                    : 'Não informado'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Sexo</td>
                                            <td className="text-right font-weight-bold">
                                                {item.nome_sexo ? item.nome_sexo : 'Não informado'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Escolaridade</td>
                                            <td className="text-right font-weight-bold">
                                                {item.nome_escolaridade ? item.nome_escolaridade : 'Não informado'}
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </div>
                    <div className="col-12 col-md-8">
                        <h4>Pontuações recentes</h4>
                        <Table hover striped bordered>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Data</th>
                                    <th>Estabelecimento</th>
                                    <th className="text-right">Pontos</th>
                                </tr>
                            </thead>
                            <tbody>{renderScores()}</tbody>
                        </Table>
                    </div>
                </div>
            ) : null}
        </PageContainer>
    );
}
