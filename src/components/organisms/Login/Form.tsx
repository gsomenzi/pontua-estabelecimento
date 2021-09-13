import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert, Button, Form as BootstrapForm, FormGroup, Label, Input, FormFeedback, Spinner } from 'reactstrap';
import './Form.scss';
import { RootState } from '../../../store';
import { signIn, getCurrentUser } from '../../../store/slices/auth';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Por favor insira um e-mail válido').required('Por favor insira um e-mail'),
    password: Yup.string().required('Por favor insira a senha'),
});

export default function Form() {
    const dispatch = useDispatch();
    const { authenticating, error } = useSelector((state: RootState) => state.auth);
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: submit,
    });
    const { values, handleChange, handleBlur, errors, touched } = formik;

    async function submit(fields: any) {
        await dispatch(signIn({ email: fields.email, password: fields.password }));
        dispatch(getCurrentUser());
    }

    return (
        <div className="form-login">
            <h2>Login</h2>
            <hr className="mt-0" />
            <BootstrapForm onSubmit={formik.handleSubmit}>
                <FormGroup className="mb-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Digite o seu e-mail"
                        value={values.email}
                        onBlur={handleBlur('email')}
                        onChange={handleChange('email')}
                        invalid={touched.email && !!errors.email}
                    />
                    <FormFeedback>{errors.email}</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="password">Senha</Label>
                    <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Digite a sua senha"
                        value={values.password}
                        onBlur={handleBlur('password')}
                        onChange={handleChange('password')}
                        invalid={touched.password && !!errors.password}
                    />
                    <FormFeedback>{errors.password}</FormFeedback>
                </FormGroup>
                <Button
                    type="submit"
                    disabled={authenticating}
                    className="mt-3"
                    style={{ width: '100%' }}
                    color="primary"
                >
                    Login
                </Button>
                {error ? (
                    <Alert className="mt-2" color="danger">
                        Usuário ou senha incorretos
                    </Alert>
                ) : null}
            </BootstrapForm>
        </div>
    );
}
