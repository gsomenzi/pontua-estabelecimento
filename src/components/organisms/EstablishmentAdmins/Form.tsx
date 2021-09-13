import React, { useEffect, useState } from 'react';
import { Form as BootstrapForm, FormGroup, Label, Input, CustomInput, FormFeedback, Button, Spinner } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getAll as getRoles } from '../../../store/slices/role';
import { RootState } from '../../../store';
import ErrorDialog from '../../molecules/ErrorDialog';

type Props = {
    /**
     * Indica se o formulário deve indicar o status de carregando
     */
    loading?: boolean;
    /**
     * Método a ser executado quando o form for submetido
     */
    onSubmit?: Function;
    /**
     * Admin da plataforma em caso de edição
     */
    admin?: any;
};

/**
 * Campos que podem sofrer alteração em caso de edição
 */
const EDITABLE_FIELDS = ['nome', 'email', 'senha'];
/**
 * Schema para validação no form
 */
const schema = Yup.object().shape({
    nome: Yup.string().required('Por favor insira um nome'),
    email: Yup.string().required('Por favor insira um e-mail').email('Por favor insira um e-mail válido'),
    senha: Yup.string(),
});

/**
 * Formulário de adição e edição do admin
 */
export default function Form(props: Props) {
    const dispatch = useDispatch();
    const { loading, admin, onSubmit } = props;
    const [resetPassword, setResetPassword] = useState(false);
    const { getting: gettingRoles, items: roles } = useSelector((state: RootState) => state.role);
    const { error } = useSelector((state: RootState) => state.establishmentAdmin);
    // BUSCA FUNCOES
    useEffect(() => {
        dispatch(getRoles());
    }, [dispatch]);
    // FORMIK
    const formik = useFormik({
        initialValues: {
            nome: '',
            email: '',
            senha: '',
        },
        validationSchema: schema,
        onSubmit: submit,
        enableReinitialize: true,
    });
    const { values, handleChange, handleBlur, handleSubmit, setFieldValue, errors: formErrors, touched } = formik;
    // ATUALIZA CAMPOS AO EDITAR
    useEffect(() => {
        if (admin) {
            Object.keys(admin).map((key) => {
                if (EDITABLE_FIELDS.indexOf(key) > -1) {
                    setFieldValue(key, admin[key]);
                }
            });
        }
    }, [admin]);
    // SUBMIT
    function submit(values: any) {
        if (onSubmit) {
            if (!values.senha) {
                values.senha = undefined;
            }
            onSubmit(values);
        }
    }
    // COMPONENTE
    return (
        <BootstrapForm onSubmit={handleSubmit}>
            {/* NOME */}
            <FormGroup>
                <Label>Nome</Label>
                <Input
                    value={values.nome}
                    onBlur={handleBlur('nome')}
                    onChange={handleChange('nome')}
                    invalid={!!(formErrors.nome && touched.nome)}
                />
                <FormFeedback>{formErrors.nome}</FormFeedback>
            </FormGroup>
            {/* EMAIL */}
            <FormGroup>
                <Label>E-mail</Label>
                <Input
                    value={values.email}
                    onBlur={handleBlur('email')}
                    onChange={handleChange('email')}
                    invalid={!!(formErrors.email && touched.email)}
                />
                <FormFeedback>{formErrors.email}</FormFeedback>
            </FormGroup>
            {/* SENHA */}
            {admin && admin.id ? (
                <FormGroup>
                    <CustomInput
                        type="switch"
                        id="senha"
                        name="senha"
                        label="Resetar senha"
                        checked={resetPassword}
                        onChange={(ev) => setResetPassword(ev.target.checked)}
                    />
                </FormGroup>
            ) : null}
            {!admin || !admin.id || resetPassword ? (
                <FormGroup>
                    <Label>Senha</Label>
                    <Input
                        type="password"
                        value={values.senha}
                        onBlur={handleBlur('senha')}
                        onChange={handleChange('senha')}
                        invalid={!!(formErrors.senha && touched.senha)}
                    />
                    <FormFeedback>{formErrors.senha}</FormFeedback>
                </FormGroup>
            ) : null}
            {/* ERROR */}
            <ErrorDialog error={error} />
            {/* SUBMIT */}
            <Button type="submit" disabled={loading} block>
                {loading ? <Spinner size="sm" /> : 'Salvar'}
            </Button>
        </BootstrapForm>
    );
}
