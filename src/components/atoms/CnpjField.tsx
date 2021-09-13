import React from 'react';
import { Input } from 'reactstrap';
import InputMask from 'react-input-mask';

export default function CnpjField(props: any) {
    return <Input {...props} mask="99.999.999/9999-99" maskChar=" " tag={InputMask} />;
}
