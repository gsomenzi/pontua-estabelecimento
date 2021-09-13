import React from 'react';
import classNames from 'classnames';

type Props = {
    color?: 'primary' | 'secondary' | 'tertiary' | 'default';
    title?: string;
    value?: string;
    extra?: string;
    iconName?: string;
};

export default function StatisticCard(props: Props) {
    const { color, title, value, iconName, extra } = props;
    return (
        <div className={classNames('statistic-card d-flex align-items-center border p-3 rounded', color)}>
            <div className="statistic-card-icon">
                <i className={classNames('bi', `bi-${iconName}`)}></i>
            </div>
            <div className="flex-1">
                <h4 className="mb-0 statistic-card-title">{title || ''}</h4>
                <h2 className="mb-0">
                    {value || ''}
                    {extra ? <small className="statistic-card-extra">{extra}</small> : null}
                </h2>
            </div>
        </div>
    );
}
