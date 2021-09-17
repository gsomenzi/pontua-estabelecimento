import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, FormGroup, Input, Label, Spinner, Tooltip } from 'reactstrap';
import BreadCrumbs from '../components/atoms/BreadCrumbs';
import PageContainer from '../components/atoms/PageContainer';
import VerticalSteps from '../components/molecules/VerticalSteps';
import { RootState } from '../store';
import { getByCode, resetUser } from '../store/slices/user';
import { useFormik } from 'formik';
import UserId from '../components/organisms/Users/UserId';
import * as Yup from 'yup';
const validationSchema = Yup.object().shape({
    pontos: Yup.number().required('Por favor insira a pontuação').min(1, 'A pontuação deve ser maior ou igual a 1'),
    users_id: Yup.number().required('O usuário não foi informado'),
});

export default function Point() {
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const [userCode, setUserCode] = useState('');
    const { item: user, getting } = useSelector((state: RootState) => state.user);

    const formik = useFormik({
        initialValues: {
            pontos: 0,
            mensagem: '',
            user,
        },
        onSubmit: () => {},
        validationSchema,
    });

    useEffect(() => {
        dispatch(resetUser());
    }, []);

    useEffect(() => {
        const cleanUserCode = userCode.match(/\d+/g)?.join('').trim();
        if (cleanUserCode && cleanUserCode.length === 6) {
            dispatch(getByCode(cleanUserCode));
        } else {
            dispatch(resetUser());
        }
    }, [userCode]);

    useEffect(() => {
        console.log(user);
    }, [user]);

    function goToNextStep(step: number) {
        if (step === 1 && user) {
            setActiveStep(step);
        }
    }

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
                                    <Input
                                        value={userCode}
                                        onChange={(e) => setUserCode(e.target.value)}
                                        placeholder="Informe o código do cliente"
                                    />
                                </FormGroup>
                                {user ? <UserId user={user} /> : null}
                                <Button disabled={!user} onClick={() => goToNextStep(1)} color="secondary">
                                    Avançar
                                </Button>
                            </VerticalSteps.Step>
                            <VerticalSteps.Step title="Realize a pontuação">asdasdasd</VerticalSteps.Step>
                        </VerticalSteps>
                    </CardBody>
                </Card>
            </div>
        </PageContainer>
    );
}
