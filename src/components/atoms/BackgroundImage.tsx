import React from 'react';

type Props = {
    children: any;
    src: string;
};

export default function BackgroundImage(props: Props) {
    const { children, src } = props;
    return (
        <div className="background-image">
            <img className="background-image-object" src={src} />
            {children}
        </div>
    );
}
