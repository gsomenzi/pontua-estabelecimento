import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem as Item } from 'reactstrap';

type BreadcrumbItem = {
    title: string;
    link?: string;
};

type Props = {
    items?: BreadcrumbItem[];
};

export default function BreadCrumbs(props: Props) {
    const { items } = props;

    function renderHome() {
        if (items && items.length) {
            return (
                <Item>
                    <Link to="/">Home</Link>
                </Item>
            );
        } else {
            return <Item active>Home</Item>;
        }
    }

    function renderItems() {
        if (items && items.length) {
            return items.map((item, i) => {
                return i === items.length - 1 ? (
                    <Item key={i} active>
                        {item.title}
                    </Item>
                ) : (
                    <Item key={i}>
                        <Link to={item.link || '#'}>{item.title}</Link>
                    </Item>
                );
            });
        }
    }

    return (
        <div>
            <Breadcrumb>
                {renderHome()}
                {renderItems()}
            </Breadcrumb>
        </div>
    );
}
