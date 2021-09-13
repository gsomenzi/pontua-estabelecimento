import React, { ReactElement } from 'react';
import { Button, Input, InputGroup, Spinner } from 'reactstrap';

type Props = {
    loading?: boolean;
    title: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    handleSearch?: Function;
    actions?: ReactElement | ReactElement[];
    sortable?: boolean;
    sortableOptions?: {
        label: string;
        value: string | number;
    }[];
    handleSort?: Function;
    hasFilter?: boolean;
    onFilterPress?: Function;
};

export default function PageHeader(props: Props) {
    const {
        actions,
        loading,
        searchPlaceholder,
        handleSearch,
        title,
        searchable,
        sortable,
        sortableOptions,
        handleSort,
        hasFilter,
        onFilterPress,
    } = props;

    function renderActions() {
        if (!actions) return null;
        if (!Array.isArray(actions)) {
            return <>{actions}</>;
        } else {
            return actions.map((action, i) => {
                return (
                    <span className="ml-1" key={i}>
                        {action}
                    </span>
                );
            });
        }
    }

    function handleFilterPress() {
        if (onFilterPress) {
            onFilterPress();
        }
    }

    return (
        <div>
            <div className="d-flex align-items-center justify-content-between">
                {/* TITULO */}
                <h1>{title}</h1>
                <div className="d-flex align-items-center">
                    {/* LOADER */}
                    {loading ? <Spinner color="secondary" /> : null}
                    {/* ACOES */}
                    <div className="d-flex align-items-center">{renderActions()}</div>
                </div>
            </div>
            <hr className="mt-0" />
            <div className="row">
                <div className="col-12 col-md-4">
                    <div className="d-flex align-items-center mb-3">
                        {searchable === undefined || searchable ? (
                            <InputGroup className="mr-1" style={{ flexGrow: 1 }}>
                                <Input
                                    placeholder={searchPlaceholder || ''}
                                    onChange={(ev) => (handleSearch ? handleSearch(ev) : null)}
                                />
                            </InputGroup>
                        ) : null}
                        {sortable ? (
                            <Input
                                type="select"
                                name="order"
                                id="selectOrder"
                                onChange={(ev) => (handleSort ? handleSort(ev) : null)}
                                style={{ width: 'auto' }}
                            >
                                {sortableOptions?.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Input>
                        ) : null}
                        {hasFilter ? (
                            <Button color="light" className="border ml-1" onClick={handleFilterPress}>
                                <i className="bi bi-funnel"></i>
                            </Button>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
