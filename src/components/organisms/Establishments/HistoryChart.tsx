import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

type Props = {
    data: EstablishmentStatisticData | null;
};

export default function HistoryChart(props: Props) {
    const [users, setUsers] = useState([0]);
    const [points, setPoints] = useState([0]);
    const [labels, setLabels] = useState(['']);
    const { data } = props;

    useEffect(() => {
        setLabels(data ? data.historicoMensal.map((e) => e.data) : []);
        setPoints(data ? data.historicoMensal.map((e) => e.pontos) : []);
        setUsers(data ? data.historicoMensal.map((e) => e.usuarios) : []);
    }, [data]);

    const options: any = {
        colors: ['#ff4136', '#f53f6f', '#57359d'],
        chart: {
            height: 350,
            type: 'line',
            stacked: false,
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: [1, 4],
        },
        title: {
            show: false,
        },
        xaxis: {
            categories: labels,
        },
        yaxis: [
            {
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: true,
                    color: '#57359d',
                },
                labels: {
                    style: {
                        colors: '#57359d',
                    },
                },
                title: {
                    text: 'Pontos convertidos',
                    style: {
                        color: '#57359d',
                    },
                },
                tooltip: {
                    enabled: true,
                },
            },
            {
                seriesName: 'Usuários',
                opposite: true,
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: true,
                    color: '#ff4136',
                },
                labels: {
                    style: {
                        colors: '#ff4136',
                    },
                },
                title: {
                    text: 'Usuários cadastrados',
                    style: {
                        color: '#ff4136',
                    },
                },
            },
        ],
        tooltip: {
            fixed: {
                enabled: true,
                position: 'topLeft',
                offsetY: 30,
                offsetX: 60,
            },
        },
        legend: {
            horizontalAlign: 'left',
            offsetX: 40,
        },
    };
    const series: any[] = [
        {
            name: 'Usuários',
            type: 'column',
            data: users,
        },
        {
            name: 'Pontos',
            type: 'line',
            data: points,
        },
    ];
    return (
        <div>
            <Chart options={options} series={series} type="line" width="100%" height={320} />
        </div>
    );
}
