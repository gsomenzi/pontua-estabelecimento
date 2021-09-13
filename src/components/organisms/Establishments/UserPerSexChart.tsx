import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

type Props = {
    data: EstablishmentStatisticData | null;
};

export default function UserPerSexChart(props: Props) {
    const { data } = props;
    const [labels, setLabels] = useState(['']);
    const [values, setValues] = useState([0]);

    useEffect(() => {
        setLabels(data && data.usuarios ? data.usuarios.por_sexo.map((e) => e.nome_sexo || 'Não informado') : []);
        setValues(data && data.usuarios ? data.usuarios.por_sexo.map((e) => parseInt(e.quantidade)) : []);
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
