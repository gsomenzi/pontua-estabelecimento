import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

type Props = {
    onDrop: Function;
};

export default function Dropzone(props: Props) {
    const onDrop = useCallback((acceptedFiles) => {
        props.onDrop(acceptedFiles);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
    return (
        <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p className="mb-0">Solte os arquivos aqui...</p>
            ) : (
                <p className="mb-0">Arraste arquivos, ou clique para selecionar</p>
            )}
        </div>
    );
}
