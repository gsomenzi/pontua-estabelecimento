import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, Form, FormFeedback, FormGroup, Input, Label, Spinner } from 'reactstrap';
import BreadCrumbs from '../components/atoms/BreadCrumbs';
import PageContainer from '../components/atoms/PageContainer';
import VerticalSteps from '../components/molecules/VerticalSteps';
import { RootState } from '../store';
import { getByCode, resetUser } from '../store/slices/user';
import { create as scoreUser, resetScore } from '../store/slices/score';
import { useFormik } from 'formik';
import UserId from '../components/organisms/Users/UserId';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
const validationSchema = Yup.object().shape({
    quantidade: Yup.number()
        .required('Por favor insira a quantidade')
        .min(1, 'A quantidade deve ser maior ou igual a 1')
        .max(20, 'A quantidade não deve ser maior que 20'),
    pontos: Yup.number().required('Por favor insira a pontuação').min(1, 'A pontuação deve ser maior ou igual a 1'),
    users_id: Yup.number().required('O usuário não foi informado'),
});

export default function Score() {
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const [userCode, setUserCode] = useState('');
    const { item: user, getting } = useSelector((state: RootState) => state.user);
    const { item: score, creating } = useSelector((state: RootState) => state.score);

    const formik = useFormik({
        initialValues: {
            quantidade: 1,
            pontos: 1,
            mensagem: '',
            users_id: null,
        },
        onSubmit: (values) => {
            dispatch(scoreUser(values));
        },
        validationSchema,
    });
    const { values, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm, errors, touched } = formik;

    /**
     * Ao carregar a página, reseta usuário selecionado e pontuação recebida
     */
    useEffect(() => {
        dispatch(resetUser());
        dispatch(resetScore());
    }, []);

    useEffect(() => {
        if (score) {
            toast(`Pontuação de ${score.pontos} pontos realizada para ${score.usuario.nome} com sucesso!`, {
                type: 'success',
            });
            resetForm();
            dispatch(resetUser());
            dispatch(resetScore());
            setUserCode('');
            goToNextStep(0);
        }
    }, [score]);

    /**
     * Ao digitar código do usuário, realiza a busca na API
     */
    useEffect(() => {
        const cleanUserCode = userCode.match(/\d+/g)?.join('').trim();
        if (cleanUserCode && cleanUserCode.length === 6) {
            dispatch(getByCode(cleanUserCode));
        } else {
            dispatch(resetUser());
        }
    }, [userCode]);

    /**
     * Ao receber usuário, ajusta campo users_id do Form
     */
    useEffect(() => {
        setFieldValue('users_id', user && user.id ? user.id : null);
    }, [user]);

    /**
     * Avança para o próximo step
     */
    function goToNextStep(step: number) {
        if (step === 0) {
            setActiveStep(0);
        }
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
                            <VerticalSteps.Step title="Realize a pontuação">
                                <Form onSubmit={formik.handleSubmit}>
                                    {/* QUANTIDADE */}
                                    <FormGroup className="mb-2">
                                        <Label htmlFor="quantidade">Quantas pessoas estão pontuando?</Label>
                                        <Input
                                            type="number"
                                            step="1"
                                            name="quantidade"
                                            id="quantidade"
                                            placeholder="Digite a quantidade de pessoas"
                                            value={values.quantidade}
                                            onBlur={handleBlur('quantidade')}
                                            onChange={handleChange('quantidade')}
                                            invalid={touched.quantidade && !!errors.quantidade}
                                        />
                                        <FormFeedback>{errors.quantidade}</FormFeedback>
                                    </FormGroup>
                                    {/* PONTOS */}
                                    <FormGroup className="mb-2">
                                        <Label htmlFor="pontos">Quantos pontos?</Label>
                                        <Input
                                            type="number"
                                            step="1"
                                            name="pontos"
                                            id="pontos"
                                            placeholder="Digite o seu e-mail"
                                            value={values.pontos}
                                            onBlur={handleBlur('pontos')}
                                            onChange={handleChange('pontos')}
                                            invalid={touched.pontos && !!errors.pontos}
                                        />
                                        <FormFeedback>{errors.pontos}</FormFeedback>
                                    </FormGroup>
                                    {/* MENSAGEM */}
                                    <FormGroup className="mb-2">
                                        <Label htmlFor="pontos">
                                            Digite uma mensagem sobre o cliente.{' '}
                                            <small>
                                                (Você será lembrado dessa mensagem na próxima vez que for pontuar para
                                                este cliente)
                                            </small>
                                        </Label>
                                        <Input
                                            type="textarea"
                                            name="mensagem"
                                            id="mensagem"
                                            placeholder="Digite uma mensagem"
                                            value={values.mensagem}
                                            onBlur={handleBlur('mensagem')}
                                            onChange={handleChange('mensagem')}
                                            invalid={touched.mensagem && !!errors.mensagem}
                                        />
                                        <FormFeedback>{errors.mensagem}</FormFeedback>
                                    </FormGroup>
                                    <Button onClick={(e: any) => goToNextStep(0)} color="light">
                                        Voltar
                                    </Button>
                                    <Button
                                        className="ml-1"
                                        type="submit"
                                        disabled={!formik.isValid || creating}
                                        onClick={(e: any) => handleSubmit(e)}
                                        color="secondary"
                                    >
                                        {creating ? <Spinner size="sm" /> : <span>Pontuar</span>}
                                    </Button>
                                </Form>
                            </VerticalSteps.Step>
                        </VerticalSteps>
                    </CardBody>
                </Card>
            </div>
        </PageContainer>
    );
}
