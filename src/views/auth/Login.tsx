import React from 'react';
import moment from 'moment';
import { Card, CardBody } from 'reactstrap';
import BackgroundImage from '../../components/atoms/BackgroundImage';
import PageContainer from '../../components/atoms/PageContainer';
import FormLogin from '../../components/organisms/Login/Form';

export default function Login() {
    return (
        <BackgroundImage src="/assets/imgs/bg-login.png">
            <PageContainer centered padded>
                <img className="mb-4" src="/assets/imgs/logo-cor.png" />
                <Card className="shadow rounded bg-body">
                    <CardBody>
                        <FormLogin />
                        <p className="mt-2 mb-0 text-center">{moment().format('YYYY')} @ Pontua Fidelidade</p>
                    </CardBody>
                </Card>
            </PageContainer>
        </BackgroundImage>
    );
}
