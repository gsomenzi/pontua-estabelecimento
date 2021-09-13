import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

type Props = {
    data: StatisticData | null;
};

export default function EstablishmentPerCategoryChart(props: Props) {
    const { data } = props;
    const [labels, setLabels] = useState(['']);
    const [values, setValues] = useState([0]);

    useEffect(() => {
        setLabels(
            data && data.estabelecimentos
                ? data.estabelecimentos.por_categoria.map((e) => e.nome || 'Não identificado')
                : []
        );
        setValues(
            data && data.estabelecimentos ? data.estabelecimentos.por_categoria.map((e) => parseInt(e.quantidade)) : []
        );
    }, [data]);

    const options: any = {
        colors: ['#57359d', '#ff4136', '#f53f6f'],
        chart: {
            type: 'bar',
            height: 350,
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: labels,
        },
    };

    const series = [
        {
            name: 'Quantidade',
            data: values,
        },
    ];

    return <div>{data ? <Chart options={options} series={series} type="bar" height={320} /> : null}</div>;
}
