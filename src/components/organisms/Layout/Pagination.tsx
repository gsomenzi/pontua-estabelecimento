import React from 'react';
import { Pagination as BootstrapPagination, PaginationItem, PaginationLink } from 'reactstrap';

type Props = {
    onNavigate?: Function;
    data: {
        page: number;
        last: number;
    };
};

export default function Pagination(props: Props) {
    const { data, onNavigate } = props;

    function handleNavigate(e: any, page: number) {
        e.preventDefault();
        if (onNavigate && page <= data.last && page > 0) {
            onNavigate(page);
        }
    }

    function renderBefore() {
        if (data.page > 1) {
            const arrayCount = Array(Math.min(data.page - 1, 5)).fill(0);
            return arrayCount.map((e, i) => {
                return (
                    <PaginationItem key={i}>
                        <PaginationLink
                            href="/"
                            onClick={(e) => handleNavigate(e, data.page - (arrayCount.length - i))}
                        >
                            {data.page - (arrayCount.length - i)}
                        </PaginationLink>
                    </PaginationItem>
                );
            });
        }
    }

    function renderAfter() {
        if (data.last > data.page) {
            return Array(Math.min(data.last - data.page, 5))
                .fill(0)
                .map((e, i) => {
                    return (
                        <PaginationItem key={i}>
                            <PaginationLink href="/" onClick={(e) => handleNavigate(e, i + data.page + 1)}>
                                {i + data.page + 1}
                            </PaginationLink>
                        </PaginationItem>
                    );
                });
        }
    }

    return (
        <BootstrapPagination>
            <PaginationItem>
                <PaginationLink first href="#" />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink previous href="/" onClick={(e) => handleNavigate(e, data.page - 1)} />
            </PaginationItem>
            {renderBefore()}
            {/* CURRENT */}
            <PaginationItem active>
                <PaginationLink href="#">{data.page}</PaginationLink>
            </PaginationItem>
            {renderAfter()}
            <PaginationItem>
                <PaginationLink next href="/" onClick={(e) => handleNavigate(e, data.page + 1)} />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink last href="#" />
            </PaginationItem>
        </BootstrapPagination>
    );
}
