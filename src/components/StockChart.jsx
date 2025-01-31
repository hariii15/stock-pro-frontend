import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockChart = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Stock Price',
        data: data.values,
        fill: true,
        borderColor: '#EFBF6D',
        tension: 0.4,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(239, 191, 109, 0.5)');
          gradient.addColorStop(1, 'rgba(27, 69, 66, 0.1)');
          return gradient;
        },
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#EFBF6D'
        }
      }
    },
    scales: {
      y: {
        ticks: { color: '#EFBF6D' },
        grid: { color: 'rgba(239, 191, 109, 0.1)' }
      },
      x: {
        ticks: { color: '#EFBF6D' },
        grid: { color: 'rgba(239, 191, 109, 0.1)' }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StockChart;
