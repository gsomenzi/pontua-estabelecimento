import React from 'react';
import { Input } from 'reactstrap';
import InputMask from 'react-input-mask';

export default function CpfField(props: any) {
    return <Input {...props} mask="999.999.999-99" maskChar=" " tag={InputMask} />;
}
