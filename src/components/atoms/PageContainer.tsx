import React from 'react';

type Props = {
    children: any;
    padded?: boolean;
    centered?: boolean;
    hasSidebar?: boolean;
};

export default function PageContainer(props: Props) {
    const { centered, children, hasSidebar, padded } = props;
    const classes = `page-container ${centered ? 'page-container-centered' : ''} ${
        padded ? 'page-container-padded' : ''
    } ${hasSidebar ? 'page-container-hassidebar' : ''}`;
    return <div className={classes}>{children}</div>;
}
