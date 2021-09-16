import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setItemCover, setItemProfile } from '../../../store/slices/product';
import { getAllByProduct, update, upload, remove } from '../../../store/slices/productImage';
import { RootState } from '../../../store';
import { Card, CardImg, CardBody, Spinner, Button, ButtonGroup } from 'reactstrap';
import ConfirmDialog from '../../molecules/ConfirmDialog';
import Dropzone from '../../molecules/Dropzone';

function ProfileLabel() {
    return <div className="tab-images-profile-label">Perfil</div>;
}

function CoverLabel() {
    return <div className="tab-images-cover-label">Capa</div>;
}

type TabImageProps = {
    product: any;
};

export default function TabImages(props: TabImageProps) {
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [selected, setSelected] = useState({ id: 0 });
    const dispatch = useDispatch();
    const { product } = props;
    const { uploading, getting, updating, removing, error, items } = useSelector(
        (state: RootState) => state.productImage
    );
    /**
     * Busca todas as imagens do produto
     */
    useEffect(() => {
        if (product) {
            dispatch(getAllByProduct(product.id));
        }
    }, [product]);
    /**
     * Seleciona uma imagem e abre modal para confirmar a remoção
     * @param e Evento do link a ser cancelado
     * @param item Imagem a ser selecionada
     */
    function handleRemove(e: any, item: any) {
        e.preventDefault();
        setSelected(item);
        setShowRemoveModal(true);
    }

    function handleCover(e: any, item: any) {
        e.preventDefault();
        setSelected(item);
        dispatch(update({ id: item.id, capa: true }));
        dispatch(setItemCover(item));
    }

    function handleProfile(e: any, item: any) {
        e.preventDefault();
        setSelected(item);
        dispatch(update({ id: item.id, perfil: true }));
        dispatch(setItemProfile(item));
    }

    /**
     * Renderiza itens da tabela
     */
    function renderItems() {
        return items.map((item, i) => {
            const isUpdating = selected && selected.id === item.id && updating;
            const isRemoving = selected && selected.id === item.id && removing;
            return (
                <div className="col-6 col-md-3 col-lg-3" key={i}>
                    <Card style={{ position: 'relative', marginBottom: '1rem' }}>
                        <div className="tab-images-slot-label">
                            {item.perfil ? <ProfileLabel /> : null}
                            {item.capa ? <CoverLabel /> : null}
                        </div>
                        <CardImg src={item.url} />
                        <CardBody>
                            <div className="d-flex align-items-center">
                                <ButtonGroup style={{ width: '100%', marginBottom: '.5rem' }}>
                                    <Button
                                        className="text-nowrap"
                                        disabled={!!item.capa}
                                        color="primary"
                                        href="/"
                                        onClick={(e: any) => handleCover(e, item)}
                                    >
                                        {isUpdating ? <Spinner size="sm" /> : <span>Capa</span>}
                                    </Button>
                                    <Button
                                        className="text-nowrap"
                                        disabled={!!item.perfil}
                                        color="secondary"
                                        href="/"
                                        onClick={(e: any) => handleProfile(e, item)}
                                    >
                                        {isUpdating ? <Spinner size="sm" /> : <span>Perfil</span>}
                                    </Button>
                                </ButtonGroup>
                            </div>
                            <Button
                                disabled={isRemoving}
                                color="danger"
                                outline
                                block
                                onClick={(e: any) => handleRemove(e, item)}
                            >
                                {isRemoving ? <Spinner size="sm" /> : <span>Remover</span>}
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            );
        });
    }
    return (
        <div>
            {getting ? <Spinner /> : null}
            <Dropzone
                onDrop={(acceptedFiles: any) => {
                    dispatch(
                        upload({
                            id: product.id,
                            file: acceptedFiles[0],
                        })
                    );
                }}
            />
            <div className="row">
                <div className="col-12">
                    <h4>Galeria de imagens</h4>
                    <hr className="mt-0" />
                    <div className="row align-items-start">{renderItems()}</div>
                </div>
            </div>
            <ConfirmDialog
                title="Remover o item?"
                text="Você tem certeza que deseja remover este item?"
                show={showRemoveModal}
                setShow={setShowRemoveModal}
                onConfirm={() => dispatch(remove(selected.id))}
            />
        </div>
    );
}
