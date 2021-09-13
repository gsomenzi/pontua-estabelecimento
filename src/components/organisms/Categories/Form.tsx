import React, { useEffect } from 'react';
import { Form as BootstrapForm, FormGroup, Label, Input, FormFeedback, Button, Spinner } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ErrorDialog from '../../molecules/ErrorDialog';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

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
     * Categoria de estabelecimentos em caso de edição
     */
    category?: any;
};

/**
 * Campos que podem sofrer alteração em caso de edição
 */
const EDITABLE_FIELDS = ['nome'];
/**
 * Schema para validação no form
 */
const schema = Yup.object().shape({
    nome: Yup.string().required('Por favor insira um nome'),
});

/**
 * Formulário de adição e edição da categoria
 */
export default function Form(props: Props) {
    const { loading, category, onSubmit } = props;
    const { error } = useSelector((state: RootState) => state.category);

    // FORMIK
    const formik = useFormik({
        initialValues: {
            nome: '',
        },
        validationSchema: schema,
        onSubmit: submit,
        enableReinitialize: true,
    });
    const { values, handleChange, handleBlur, handleSubmit, setFieldValue, errors: formErrors, touched } = formik;
    // ATUALIZA CAMPOS AO EDITAR
    useEffect(() => {
        if (category) {
            Object.keys(category).map((key) => {
                if (EDITABLE_FIELDS.indexOf(key) > -1) {
                    setFieldValue(key, category[key]);
                }
            });
        }
    }, [category]);
    // SUBMIT
    function submit(values: any) {
        if (onSubmit) {
            onSubmit(values);
        }
    }
    // COMPONENTE
    return (
        <BootstrapForm onSubmit={handleSubmit}>
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
            {/* ERROR */}
            <ErrorDialog error={error} />
            <Button type="submit" disabled={loading} block>
                {loading ? <Spinner size="sm" /> : 'Salvar'}
            </Button>
        </BootstrapForm>
    );
}
