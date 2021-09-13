import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

type Props = {
    data: ProductStatisticData | null;
};

const dayNames: any = {
    1: 'Segunda-feira',
    2: 'Terça-feira',
    3: 'Quarta-feira',
    4: 'Quinta-feira',
    5: 'Sexta-feira',
    6: 'Sábado',
    7: 'Domingo',
};

export default function TopWeekdaysChart(props: Props) {
    const { data } = props;
    const [labels, setLabels] = useState(['']);
    const [values, setValues] = useState([0]);

    useEffect(() => {
        setLabels(
            data && data.dias
                ? data.dias.map((e) => (dayNames[e.dia_semana] ? dayNames[e.dia_semana] : 'Não identificado'))
                : []
        );
        setValues(data && data.dias ? data.dias.map((e) => parseInt(e.quantidade)) : []);
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

    return <div>{data ? <Chart options={options} series={series} type="bar" height={280} /> : null}</div>;
}
