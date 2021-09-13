import React from 'react';

import PageContainer from '../atoms/PageContainer';

export default function PageLoader() {
    return (
        <PageContainer centered>
            <div className="page-loader">
                <div className="page-loader-image">
                    <img src="/assets/imgs/symbol.png" />
                </div>
            </div>
        </PageContainer>
    );
}
