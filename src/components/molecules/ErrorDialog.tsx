import React from 'react';
import { Alert } from 'reactstrap';

type Props = {
    error?: AppError;
};

export default function ErrorDialog(props: Props) {
    const { error } = props;
    return error ? (
        <Alert color="danger" className="mt-1">
            <p className="text-bold mb-0">{error.title}</p>
            {error.description ? <p className="mb-0">{error.description}</p> : null}
            {error.items && error.items.length > 0 ? (
                <ul className="mt-1 mb-0">
                    {error.items.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            ) : null}
        </Alert>
    ) : null;
}
