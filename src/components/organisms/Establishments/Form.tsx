import React, { useEffect, useState } from 'react';
import { Form as BootstrapForm, FormGroup, Label, Input, FormFeedback, Button, ButtonGroup, Spinner } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CnpjField from '../../atoms/CnpjField';
import CpfField from '../../atoms/CpfField';
import PhoneField from '../../atoms/PhoneField';
import ZipcodeField from '../../atoms/ZipcodeField';
import StateSelect from '../../atoms/StateSelect';
import VerticalSteps from '../../molecules/VerticalSteps';
import { useDispatch, useSelector } from 'react-redux';
import { getAll as getCategories } from '../../../store/slices/category';
import { RootState } from '../../../store';
import ErrorDialog from '../../molecules/ErrorDialog';
import CepService from '../../../services/cep';

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
     * Estabelecimento em caso de edição
     */
    establishment?: any;
};

/**
 * Campos que podem sofrer alteração em caso de edição
 */
const EDITABLE_FIELDS = [
    'razao_social',
    'nome_fantasia',
    'tipo',
    'cnpj',
    'cpf',
    'categorias_id',
    'email',
    'telefone',
    'whatsapp',
    'facebook',
    'instagram',
    'site',
    'cep',
    'estado',
    'cidade',
    'bairro',
    'logradouro',
    'numero',
    'complemento',
    'regras',
    'dias_expiracao_pontos',
    'status',
];
/**
 * Schema para validação no form
 */
const schema = Yup.object().shape({
    razao_social: Yup.string().required('Por favor insira uma razão social'),
    email: Yup.string().required('Por favor insira um e-mail').email('Por favor insira um e-mail válido'),
    tipo: Yup.string().required('Por favor selecione um tipo').oneOf(['pessoa_fisica', 'pessoa_juridica']),
    categorias_id: Yup.string().required('Por favor selecione uma categoria'),
    cep: Yup.string().required('Por favor selecione um CEP'),
    estado: Yup.string().required('Por favor selecione um estado'),
    cidade: Yup.string().required('Por favor insira a cidade'),
    regras: Yup.string().required('Por favor insira as regras'),
    dias_expiracao_pontos: Yup.number().required('Por favor selecione o tempo de expiração dos pontos'),
    status: Yup.string().required('Por favor selecione um status').oneOf(['ativo', 'inativo']),
    facebook: Yup.string().url('Por favor insira uma URL válida'),
    instagram: Yup.string().url('Por favor insira uma URL válida'),
    site: Yup.string().url('Por favor insira uma URL válida'),
});

/**
 * Formulário de adição e edição do estabelecimento
 */
export default function Form(props: Props) {
    const { loading, establishment, onSubmit } = props;
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const { getting, items: categories } = useSelector((state: RootState) => state.category);
    const { error } = useSelector((state: RootState) => state.establishment);

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    // FORMIK
    const formik = useFormik({
        initialValues: {
            razao_social: '',
            email: '',
            nome_fantasia: '',
            tipo: 'pessoa_juridica',
            cnpj: '',
            cpf: '',
            categorias_id: '',
            telefone: '',
            whatsapp: '',
            facebook: '',
            instagram: '',
            site: '',
            cep: '',
            estado: 'RS',
            cidade: '',
            bairro: '',
            logradouro: '',
            numero: '',
            complemento: '',
            regras: '',
            dias_expiracao_pontos: 365,
            status: 'ativo',
        },
        validationSchema: schema,
        onSubmit: submit,
        enableReinitialize: true,
    });
    const { values, handleChange, handleBlur, handleSubmit, setFieldValue, errors: formErrors, touched } = formik;
    //
    async function handleCepChange(e: any) {
        setFieldValue('cep', e.target.value);
        const cepData = await CepService.getDataByCep(e.target.value);
        if (cepData) {
            setFieldValue('bairro', cepData.bairro);
            setFieldValue('cidade', cepData.localidade);
            setFieldValue('logradouro', cepData.logradouro);
            setFieldValue('estado', cepData.uf);
        }
    }
    // ATUALIZA CAMPOS AO EDITAR
    useEffect(() => {
        if (establishment) {
            Object.keys(establishment).map((key) => {
                if (EDITABLE_FIELDS.indexOf(key) > -1) {
                    setFieldValue(key, establishment[key] ? establishment[key] : '');
                }
            });
        }
    }, [establishment]);
    // SUBMIT
    function submit(values: any) {
        if (onSubmit) {
            onSubmit(values);
        }
    }
    // COMPONENTE
    return (
        <BootstrapForm onSubmit={handleSubmit}>
            <VerticalSteps activeStep={activeStep} setActiveStep={setActiveStep}>
                {/* STEP 1 */}
                <VerticalSteps.Step title="Geral">
                    {/* RAZAO SOCIAL */}
                    <FormGroup>
                        <Label>Razão social</Label>
                        <Input
                            value={values.razao_social}
                            onBlur={handleBlur('razao_social')}
                            onChange={handleChange('razao_social')}
                            invalid={!!(formErrors.razao_social && touched.razao_social)}
                        />
                        <FormFeedback>{formErrors.razao_social}</FormFeedback>
                    </FormGroup>
                    {/* NOME FANTASIA */}
                    <FormGroup>
                        <Label>Nome fantasia</Label>
                        <Input
                            value={values.nome_fantasia}
                            onBlur={handleBlur('nome_fantasia')}
                            onChange={handleChange('nome_fantasia')}
                            invalid={!!(formErrors.nome_fantasia && touched.nome_fantasia)}
                        />
                        <FormFeedback>{formErrors.nome_fantasia}</FormFeedback>
                    </FormGroup>
                    {/* TIPO */}
                    <FormGroup>
                        <Label>Tipo</Label>
                        <Input
                            type="select"
                            value={values.tipo}
                            onBlur={handleBlur('tipo')}
                            onChange={handleChange('tipo')}
                            invalid={!!(formErrors.tipo && touched.tipo)}
                        >
                            <option value="pessoa_juridica">Pessoa jurídica</option>
                            <option value="pessoa_fisica">Pessoa física</option>
                        </Input>
                        <FormFeedback>{formErrors.tipo}</FormFeedback>
                    </FormGroup>
                    {/* CNPJ */}
                    {values.tipo === 'pessoa_juridica' ? (
                        <FormGroup>
                            <Label>CNPJ</Label>
                            <CnpjField
                                value={values.cnpj}
                                onBlur={handleBlur('cnpj')}
                                onChange={handleChange('cnpj')}
                                invalid={!!(formErrors.cnpj && touched.cnpj)}
                            />
                            <FormFeedback>{formErrors.cnpj}</FormFeedback>
                        </FormGroup>
                    ) : (
                        <FormGroup>
                            <Label>CPF</Label>
                            <CpfField
                                value={values.cpf}
                                onBlur={handleBlur('cpf')}
                                onChange={handleChange('cpf')}
                                invalid={!!(formErrors.cpf && touched.cpf)}
                            />
                            <FormFeedback>{formErrors.cpf}</FormFeedback>
                        </FormGroup>
                    )}
                    {/* CATEGORIA */}
                    <FormGroup>
                        <Label>Categoria</Label>
                        <Input
                            type="select"
                            value={values.categorias_id}
                            onBlur={handleBlur('categorias_id')}
                            onChange={handleChange('categorias_id')}
                            invalid={!!(formErrors.categorias_id && touched.categorias_id)}
                        >
                            <option value="">Selecione</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.nome}
                                </option>
                            ))}
                        </Input>
                        <FormFeedback>{formErrors.categorias_id}</FormFeedback>
                    </FormGroup>
                    {/* AVANCAR */}
                    <div className="text-right">
                        <Button onClick={() => setActiveStep(1)}>Avançar</Button>
                    </div>
                </VerticalSteps.Step>
                {/* STEP 2 */}
                <VerticalSteps.Step title="Contato">
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
                    {/* TELEFONE */}
                    <FormGroup>
                        <Label>Telefone</Label>
                        <PhoneField
                            value={values.telefone}
                            onBlur={handleBlur('telefone')}
                            onChange={handleChange('telefone')}
                            invalid={!!(formErrors.telefone && touched.telefone)}
                        />
                        <FormFeedback>{formErrors.telefone}</FormFeedback>
                    </FormGroup>
                    {/* WHATSAPP */}
                    <FormGroup>
                        <Label>WhatsApp</Label>
                        <PhoneField
                            value={values.whatsapp}
                            onBlur={handleBlur('whatsapp')}
                            onChange={handleChange('whatsapp')}
                            invalid={!!(formErrors.whatsapp && touched.whatsapp)}
                        />
                        <FormFeedback>{formErrors.whatsapp}</FormFeedback>
                    </FormGroup>
                    {/* FACEBOOK */}
                    <FormGroup>
                        <Label>Facebook</Label>
                        <Input
                            value={values.facebook}
                            onBlur={handleBlur('facebook')}
                            onChange={handleChange('facebook')}
                            invalid={!!(formErrors.facebook && touched.facebook)}
                            placeholder="Copie e cole a URL do seu perfil"
                        />
                        <FormFeedback>{formErrors.facebook}</FormFeedback>
                        {!formErrors.facebook ? (
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary"
                                href={values.facebook}
                            >
                                Clique para testar o link
                            </a>
                        ) : null}
                    </FormGroup>
                    {/* INSTAGRAM */}
                    <FormGroup>
                        <Label>Instagram</Label>
                        <Input
                            value={values.instagram}
                            onBlur={handleBlur('instagram')}
                            onChange={handleChange('instagram')}
                            invalid={!!(formErrors.instagram && touched.instagram)}
                            placeholder="Copie e cole a URL do seu perfil"
                        />
                        <FormFeedback>{formErrors.instagram}</FormFeedback>
                        {!formErrors.instagram ? (
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary"
                                href={values.instagram}
                            >
                                Clique para testar o link
                            </a>
                        ) : null}
                    </FormGroup>
                    {/* SITE */}
                    <FormGroup>
                        <Label>Website</Label>
                        <Input
                            value={values.site}
                            onBlur={handleBlur('site')}
                            onChange={handleChange('site')}
                            invalid={!!(formErrors.site && touched.site)}
                            placeholder="Copie e cole a URL"
                        />
                        <FormFeedback>{formErrors.site}</FormFeedback>
                        {!formErrors.site ? (
                            <a target="_blank" rel="noopener noreferrer" className="text-primary" href={values.site}>
                                Clique para testar o link
                            </a>
                        ) : null}
                    </FormGroup>
                    <div className="text-right">
                        <ButtonGroup>
                            <Button color="default" onClick={() => setActiveStep(0)}>
                                Voltar
                            </Button>
                            <Button onClick={() => setActiveStep(2)}>Avançar</Button>
                        </ButtonGroup>
                    </div>
                </VerticalSteps.Step>
                {/* STEP 3 */}
                <VerticalSteps.Step title="Endereço">
                    {/* CEP */}
                    <FormGroup>
                        <Label>CEP</Label>
                        <ZipcodeField
                            value={values.cep}
                            onBlur={handleBlur('cep')}
                            onChange={(e: any) => handleCepChange(e)}
                            invalid={!!(formErrors.cep && touched.cep)}
                        />
                        <FormFeedback>{formErrors.cep}</FormFeedback>
                    </FormGroup>
                    {/* ESTADO */}
                    <FormGroup>
                        <Label>Estado</Label>
                        <StateSelect
                            value={values.estado}
                            onBlur={handleBlur('estado')}
                            onChange={handleChange('estado')}
                            invalid={!!(formErrors.estado && touched.estado)}
                        />
                        <FormFeedback>{formErrors.estado}</FormFeedback>
                    </FormGroup>
                    {/* CIDADE */}
                    <FormGroup>
                        <Label>Cidade</Label>
                        <Input
                            value={values.cidade}
                            onBlur={handleBlur('cidade')}
                            onChange={handleChange('cidade')}
                            invalid={!!(formErrors.cidade && touched.cidade)}
                        />
                        <FormFeedback>{formErrors.cidade}</FormFeedback>
                    </FormGroup>
                    {/* BAIRRO */}
                    <FormGroup>
                        <Label>Bairro</Label>
                        <Input
                            value={values.bairro}
                            onBlur={handleBlur('bairro')}
                            onChange={handleChange('bairro')}
                            invalid={!!(formErrors.bairro && touched.bairro)}
                        />
                        <FormFeedback>{formErrors.bairro}</FormFeedback>
                    </FormGroup>
                    {/* LOGRADOURO */}
                    <FormGroup>
                        <Label>Logradouro</Label>
                        <Input
                            value={values.logradouro}
                            onBlur={handleBlur('logradouro')}
                            onChange={handleChange('logradouro')}
                            invalid={!!(formErrors.logradouro && touched.logradouro)}
                        />
                        <FormFeedback>{formErrors.logradouro}</FormFeedback>
                    </FormGroup>
                    {/* NÚMERO */}
                    <FormGroup>
                        <Label>Número</Label>
                        <Input
                            value={values.numero}
                            onBlur={handleBlur('numero')}
                            onChange={handleChange('numero')}
                            invalid={!!(formErrors.numero && touched.numero)}
                        />
                        <FormFeedback>{formErrors.numero}</FormFeedback>
                    </FormGroup>
                    {/* COMPLEMENTO */}
                    <FormGroup>
                        <Label>Complemento</Label>
                        <Input
                            value={values.complemento}
                            onBlur={handleBlur('complemento')}
                            onChange={handleChange('complemento')}
                            invalid={!!(formErrors.complemento && touched.complemento)}
                        />
                        <FormFeedback>{formErrors.complemento}</FormFeedback>
                    </FormGroup>
                    <div className="text-right">
                        <ButtonGroup>
                            <Button color="default" onClick={() => setActiveStep(1)}>
                                Voltar
                            </Button>
                            <Button onClick={() => setActiveStep(3)}>Avançar</Button>
                        </ButtonGroup>
                    </div>
                </VerticalSteps.Step>
                {/* STEP 4 */}
                <VerticalSteps.Step title="Final">
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
                    {/* TEMPO EXPIRAÇÃO */}
                    <FormGroup>
                        <Label>Tempo de expiração dos pontos</Label>
                        <Input
                            type="select"
                            value={values.dias_expiracao_pontos}
                            onBlur={handleBlur('dias_expiracao_pontos')}
                            onChange={handleChange('dias_expiracao_pontos')}
                            invalid={!!(formErrors.dias_expiracao_pontos && touched.dias_expiracao_pontos)}
                        >
                            <option value="30">1 mês</option>
                            <option value="90">3 meses</option>
                            <option value="180">6 meses</option>
                            <option value="365">1 ano</option>
                        </Input>
                        <FormFeedback>{formErrors.dias_expiracao_pontos}</FormFeedback>
                    </FormGroup>
                    {/* STATUS */}
                    <FormGroup>
                        <Label>Status</Label>
                        <Input
                            type="select"
                            value={values.status}
                            onBlur={handleBlur('status')}
                            onChange={handleChange('status')}
                            invalid={!!(formErrors.status && touched.status)}
                        >
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </Input>
                        <FormFeedback>{formErrors.status}</FormFeedback>
                    </FormGroup>
                    {/* ERROR */}
                    <ErrorDialog error={error} />
                    <div className="text-right">
                        <ButtonGroup>
                            <Button color="default" onClick={() => setActiveStep(2)}>
                                Voltar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? <Spinner size="sm" /> : 'Salvar'}
                            </Button>
                        </ButtonGroup>
                    </div>
                </VerticalSteps.Step>
            </VerticalSteps>
        </BootstrapForm>
    );
}
