import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Plot = ({symbol}) => {
    const options = {
    responsive: true,
    plugins: {
        legend: {
        position: 'top',
        },
        title: {
        display: true,
        text: `${symbol} Prices`,
        },
    },
    };
    
    const [labels, setLabels] = useState([])
    
    let data = {
        labels,
        datasets: [
        ],
    };

    const pushData = (title, series, color) => {
        data['datasets'].push(
            {
                label: `${title}`,
                data: series,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: color,
            }
        );
    };

    const [resData, setResData] = useState([]);

    const flatten = (indexedSeries) => {
        let series = [];
        for(let i = 0; i < Object.keys(indexedSeries).length; i++) {
            series.push(indexedSeries[`${i}`]);
        }
        return series;
    }

    const getData = async () => {
        console.log(`127.0.0.1:5000/symbol/${symbol}`)
        const res = await axios.get(`http://127.0.0.1:5000/symbol/${symbol}`);
        setResData((data) => {
            let keys = Object.keys(res['data'])

            let fixedData = {};
            res['data']['open'] = flatten(res['data']['open'])
            res['data']['close'] = flatten(res['data']['close'])
            res['data']['adjusted_close'] = flatten(res['data']['adjusted_close'])
            res['data']['low'] = flatten(res['data']['low'])
            res['data']['high'] = flatten(res['data']['high'])
            console.log(fixedData)
            return res['data'];
        });
    };

    

    useEffect(()=>{
        getData();
    }, [symbol]);

    useEffect(()=>{
        if(!resData || !resData['date']) return;
        let newLabels = [];
        for(let i = 0; i < Object.keys(resData['date']).length; i++)
        newLabels.push((new Date(resData['date'][`${i}`])).toDateString())
        setLabels(labels=>newLabels)
    }, [resData, symbol])

    data = {
        labels,
        datasets: [
        ],
    };
    pushData('Open', resData['open'], 'rgba(255, 99, 132, 0.5)');
    pushData('Close', resData['close'], 'rgba(99, 255, 132, 0.5)');
    pushData('Adjusted Close', resData['adjusted_close'], 'rgba(0, 99, 255, 0.5)');
    pushData('Low', resData['low'], 'rgba(255, 0, 255, 0.5)');
    pushData('High', resData['high'], 'rgba(0, 255, 132, 0.5)');

    console.log(data);

    return (
        <>
            <Line options={options} data={data} />
        </>
    );
};

export default Plot;