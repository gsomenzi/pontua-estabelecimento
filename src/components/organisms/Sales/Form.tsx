import React, { useEffect } from 'react';
import { Form as BootstrapForm, FormGroup, Label, Input, FormFeedback, Button, Spinner, CustomInput } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import moment from 'moment';
import classNames from 'classnames';
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
     * Promoção em caso de edição
     */
    sale?: any;
};

/**
 * Campos que podem sofrer alteração em caso de edição
 */
const EDITABLE_FIELDS = ['nome', 'descricao', 'ativo'];
/**
 * Schema para validação no form
 */
const schema = Yup.object().shape({
    nome: Yup.string().required('Por favor insira um nome'),
    descricao: Yup.string().required('Por favor insira uma descrição'),
    inicio_validade: Yup.string().required('Por favor informe o início da validade'),
    final_validade: Yup.string().required('Por favor informe o final da validade'),
    ativo: Yup.bool(),
});

const DATE_FORMAT = 'DD/MM/YYYY';

/**
 * Formulário de adição e edição do produto
 */
export default function Form(props: Props) {
    const { loading, sale, onSubmit } = props;
    const { error } = useSelector((state: RootState) => state.sale);

    // FORMIK
    const formik = useFormik({
        initialValues: {
            nome: '',
            descricao: '',
            inicio_validade: moment().format(DATE_FORMAT),
            final_validade: moment().add(3, 'months').format(DATE_FORMAT),
            ativo: true,
        },
        validationSchema: schema,
        onSubmit: submit,
        enableReinitialize: true,
    });
    const { values, handleChange, handleBlur, handleSubmit, setFieldValue, errors: formErrors, touched } = formik;
    // ATUALIZA CAMPOS AO EDITAR
    useEffect(() => {
        if (sale) {
            Object.keys(sale).map((key) => {
                if (EDITABLE_FIELDS.indexOf(key) > -1) {
                    setFieldValue(key, sale[key]);
                }
            });
            if (sale.inicio_validade) {
                setFieldValue('inicio_validade', moment(sale.inicio_validade).format(DATE_FORMAT));
            }
            if (sale.final_validade) {
                setFieldValue('final_validade', moment(sale.final_validade).format(DATE_FORMAT));
            }
        }
    }, [sale]);
    // SUBMIT
    function submit(values: any) {
        const finalValues = { ...values };
        if (finalValues.inicio_validade) {
            finalValues.inicio_validade = moment(finalValues.inicio_validade, DATE_FORMAT).format('YYYY-MM-DD');
        }
        if (finalValues.final_validade) {
            finalValues.final_validade = moment(finalValues.final_validade, DATE_FORMAT).format('YYYY-MM-DD');
        }
        if (onSubmit) {
            onSubmit(finalValues);
        }
    }
    // COMPONENTE
    return (
        <BootstrapForm onSubmit={handleSubmit}>
            {/* NOME */}
            <FormGroup>
                <Label>Tîtulo</Label>
                <Input
                    value={values.nome}
                    onBlur={handleBlur('nome')}
                    onChange={handleChange('nome')}
                    invalid={!!(formErrors.nome && touched.nome)}
                />
                <FormFeedback>{formErrors.nome}</FormFeedback>
            </FormGroup>
            {/* DESCRICAO */}
            <FormGroup>
                <Label>Descrição</Label>
                <Input
                    type="textarea"
                    rows={4}
                    value={values.descricao}
                    onBlur={handleBlur('descricao')}
                    onChange={handleChange('descricao')}
                    invalid={!!(formErrors.descricao && touched.descricao)}
                />
                <FormFeedback>{formErrors.descricao}</FormFeedback>
            </FormGroup>
            {/* INICIO VALIDADE */}
            <FormGroup>
                <Label>Valida desde</Label>
                <Flatpickr
                    className={classNames('form-control', {
                        'is-invalid': !!(formErrors.inicio_validade && touched.inicio_validade),
                    })}
                    value={values.inicio_validade}
                    onChange={(date) => {
                        setFieldValue('inicio_validade', date ? date[0] : '');
                    }}
                    options={{
                        dateFormat: 'd/m/Y',
                    }}
                />
                <FormFeedback>{formErrors.inicio_validade}</FormFeedback>
            </FormGroup>
            {/* FINAL VALIDADE */}
            <FormGroup>
                <Label>Valida até</Label>
                <Flatpickr
                    className={classNames('form-control', {
                        'is-invalid': !!(formErrors.final_validade && touched.final_validade),
                    })}
                    value={values.final_validade}
                    onChange={(date) => {
                        setFieldValue('final_validade', date ? date[0] : '');
                    }}
                    options={{
                        dateFormat: 'd/m/Y',
                    }}
                />
                <FormFeedback>{formErrors.final_validade}</FormFeedback>
            </FormGroup>
            {/* ATIVO */}
            <FormGroup>
                <CustomInput
                    type="switch"
                    id="switchAtivo"
                    name="ativo"
                    label="Promoção ativa no sistema"
                    checked={values.ativo}
                    onChange={(ev) => setFieldValue('ativo', ev.target.checked)}
                />
            </FormGroup>
            {/* ERROR */}
            <ErrorDialog error={error} />
            {/* SUBMIT */}
            <Button type="submit" disabled={loading} block>
                {loading ? <Spinner size="sm" /> : 'Salvar'}
            </Button>
        </BootstrapForm>
    );
}
