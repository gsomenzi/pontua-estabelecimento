import React, { useEffect } from 'react';
import { Form as BootstrapForm, FormGroup, Label, Input, FormFeedback, Button, Spinner, CustomInput } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
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
     * Produto em caso de edição
     */
    product?: any;
};

/**
 * Campos que podem sofrer alteração em caso de edição
 */
const EDITABLE_FIELDS = ['nome', 'descricao', 'tipo_pontuacao', 'pontos', 'quantidade', 'ativo', 'regras'];
/**
 * Schema para validação no form
 */
const schema = Yup.object().shape({
    nome: Yup.string().required('Por favor insira um nome'),
    descricao: Yup.string().required('Por favor insira uma descrição'),
    tipo_pontuacao: Yup.string()
        .required('Por favor selecione o tipo de pontuação')
        .oneOf(['pontos', 'quantidade'], 'Por favor selecione um tipo válido'),
    pontos: Yup.number().when('tipo_pontuacao', {
        is: 'pontos',
        then: Yup.number()
            .required('Por favor informe uma pontuação válida')
            .min(1, 'A pontuação deve ser maior que 0'),
    }),
    quantidade: Yup.number().when('tipo_pontuacao', {
        is: 'quantidade',
        then: Yup.number()
            .required('Por favor informe uma quantidade válida')
            .min(1, 'A quantidade deve ser maior que 0'),
    }),
    ativo: Yup.bool(),
    regras: Yup.string().required('Por favor informe as regras de pontuação do produto'),
});

/**
 * Formulário de adição e edição do produto
 */
export default function Form(props: Props) {
    const { loading, product, onSubmit } = props;
    const { error } = useSelector((state: RootState) => state.product);

    // FORMIK
    const formik = useFormik({
        initialValues: {
            nome: '',
            descricao: '',
            tipo_pontuacao: 'pontos',
            pontos: 1,
            quantidade: 1,
            ativo: true,
            regras: '',
        },
        validationSchema: schema,
        onSubmit: submit,
        enableReinitialize: true,
    });
    const { values, handleChange, handleBlur, handleSubmit, setFieldValue, errors: formErrors, touched } = formik;
    // ATUALIZA CAMPOS AO EDITAR
    useEffect(() => {
        if (product) {
            Object.keys(product).map((key) => {
                if (EDITABLE_FIELDS.indexOf(key) > -1) {
                    setFieldValue(key, product[key]);
                }
            });
        }
    }, [product]);
    // SUBMIT
    function submit(values: any) {
        if (onSubmit) {
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
            {/* TIPO PONTUACAO */}
            <FormGroup>
                <Label>Tipo da pontuação</Label>
                <Input
                    type="select"
                    value={values.tipo_pontuacao}
                    onBlur={handleBlur('tipo_pontuacao')}
                    onChange={handleChange('tipo_pontuacao')}
                    invalid={!!(formErrors.tipo_pontuacao && touched.tipo_pontuacao)}
                >
                    <option value="pontos">Pontos</option>
                    <option value="quantidade">Quantidade</option>
                </Input>
                <FormFeedback>{formErrors.tipo_pontuacao}</FormFeedback>
            </FormGroup>
            {/* PONTOS */}
            {values.tipo_pontuacao === 'pontos' ? (
                <FormGroup>
                    <Label>Pontos</Label>
                    <Input
                        type="number"
                        step="1"
                        value={values.pontos}
                        onBlur={handleBlur('pontos')}
                        onChange={handleChange('pontos')}
                        invalid={!!(formErrors.pontos && touched.pontos)}
                    />
                    <FormFeedback>{formErrors.pontos}</FormFeedback>
                </FormGroup>
            ) : null}
            {/* QUANTIDADE */}
            {values.tipo_pontuacao === 'quantidade' ? (
                <FormGroup>
                    <Label>Quantidade</Label>
                    <Input
                        type="number"
                        step="1"
                        value={values.quantidade}
                        onBlur={handleBlur('quantidade')}
                        onChange={handleChange('quantidade')}
                        invalid={!!(formErrors.quantidade && touched.quantidade)}
                    />
                    <FormFeedback>{formErrors.quantidade}</FormFeedback>
                </FormGroup>
            ) : null}
            {/* ATIVO */}
            <FormGroup>
                <CustomInput
                    type="switch"
                    id="switchAtivo"
                    name="ativo"
                    label="Prêmio ativo no sistema"
                    checked={values.ativo}
                    onChange={(ev) => setFieldValue('ativo', ev.target.checked)}
                />
            </FormGroup>
            {/* REGRAS */}
            <FormGroup>
                <Label>Regras</Label>
                <Input
                    type="textarea"
                    rows={4}
                    value={values.regras}
                    onBlur={handleBlur('regras')}
                    onChange={handleChange('regras')}
                    invalid={!!(formErrors.regras && touched.regras)}
                />
                <FormFeedback>{formErrors.regras}</FormFeedback>
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
