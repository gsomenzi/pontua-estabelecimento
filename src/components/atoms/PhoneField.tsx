import React, { useState, useEffect } from 'react';
import { Input } from 'reactstrap';
import InputMask from 'react-input-mask';

export default function PhoneField(props: any) {
    const [mask, setMask] = useState('(99) 9999-99999');
    useEffect(() => {
        const realValue = props.value
            ? props.value.replace('(', '').replace(')', '').replace('-', '').replace(/\s/g, '')
            : '';
        if (realValue.length >= 11) {
            setMask('(99) 99999-9999');
        } else {
            setMask('(99) 9999-99999');
        }
    }, [props.value]);
    return <Input {...props} mask={mask} maskChar=" " tag={InputMask} />;
}
