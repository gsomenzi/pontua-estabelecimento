import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, FormFeedback, FormGroup, Input, Label, Spinner } from 'reactstrap';
import BreadCrumbs from '../components/atoms/BreadCrumbs';
import PageContainer from '../components/atoms/PageContainer';
import VerticalSteps from '../components/molecules/VerticalSteps';
import { RootState } from '../store';
import { getOne } from '../store/slices/user';

export default function Point() {
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const { items: topUsers, getting } = useSelector((state: RootState) => state.user);

    async function getData() {}

    useEffect(() => {
        getData();
    }, []);

    return (
        <PageContainer padded hasSidebar>
            <BreadCrumbs />
            <div className="d-flex align-items-center justify-content-between">
                <h1>Pontuar um cliente</h1>
                {getting ? <Spinner color="secondary" /> : null}
            </div>
            <hr className="mt-0" />
            {/* CONTEUDO */}
            <div>
                <Card>
                    <CardBody>
                        <VerticalSteps activeStep={activeStep} setActiveStep={setActiveStep}>
                            <VerticalSteps.Step title="Leia o QR Code do usuário ou digite manualmente">
                                <FormGroup>
                                    <Label>Código do cliente</Label>
                                    <Input placeholder="Informe o código do cliente" />
                                </FormGroup>
                                <Button color="secondary">Avançar</Button>
                            </VerticalSteps.Step>
                            <VerticalSteps.Step title="Realize a pontuação">asdasdasd</VerticalSteps.Step>
                        </VerticalSteps>
                    </CardBody>
                </Card>
            </div>
        </PageContainer>
    );
}
