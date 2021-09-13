import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

type Props = {
    data: ProductStatisticData | null;
};

export default function HistoryChart(props: Props) {
    const [qty, setQty] = useState([0]);
    const [labels, setLabels] = useState(['']);
    const { data } = props;

    useEffect(() => {
        setLabels(data ? data.historico.map((e) => e.dia) : []);
        setQty(data ? data.historico.map((e) => e.quantidade) : []);
    }, [data]);

    const options: any = {
        colors: ['#57359d', '#ff4136', '#f53f6f'],
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
            width: [4, 1, 1],
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
                    text: 'Resgates',
                    style: {
                        color: '#57359d',
                    },
                },
                tooltip: {
                    enabled: true,
                },
            },
        ],
        tooltip: {
            fixed: {
                enabled: true,
                position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
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
            name: 'Resgates',
            type: 'column',
            data: qty,
        },
    ];
    return (
        <div>
            <Chart options={options} series={series} type="line" width="100%" height={320} />
        </div>
    );
}
