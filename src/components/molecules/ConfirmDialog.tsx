import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

type Props = {
    show: boolean;
    setShow: Function;
    title?: string;
    text?: string;
    cancelText?: string;
    okText?: string;
    onConfirm?: Function;
};

export default function ConfirmDialog(props: Props) {
    const { show, setShow, title, text, cancelText, okText, onConfirm } = props;

    function handleConfirm() {
        if (typeof onConfirm === 'function') onConfirm();
        setShow(false);
    }

    return (
        <div>
            <Modal isOpen={show} onToggle={() => setShow(!show)}>
                <ModalHeader toggle={() => setShow(!show)}>{title || 'Você tem certeza?'}</ModalHeader>
                <ModalBody>{text || 'Você realmente tem certeza que deseja executar esta ação?'}</ModalBody>
                <ModalFooter>
                    <Button color="default" onClick={() => setShow(!show)}>
                        {cancelText || 'Cancelar'}
                    </Button>{' '}
                    <Button color="primary" onClick={handleConfirm}>
                        {okText || 'Sim'}
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
