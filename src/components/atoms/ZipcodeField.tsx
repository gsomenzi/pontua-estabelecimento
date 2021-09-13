import React from 'react';
import { Input } from 'reactstrap';
import InputMask from 'react-input-mask';

export default function ZipcodeField(props: any) {
    return <Input {...props} mask="99999-999" maskChar=" " tag={InputMask} />;
}
