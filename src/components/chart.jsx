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

const Chart = ({ date, close }) => {
  const chartData = {
    labels: date.reverse(),
    datasets: [
      {
        label: 'Stock Price',
        data: close.reverse(),
        fill: true,
        borderColor: '#bd34fe', // Keep purple line
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#bd34fe',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(189, 52, 254, 0.3)'); // Purple gradient
          gradient.addColorStop(1, 'rgba(147, 51, 234, 0.05)');
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
          color: '#e2e8f0', // Light gray for text
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: 'Price Trend Analysis',
        color: '#e2e8f0', // Light gray for title
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        ticks: { 
          color: '#e2e8f0', // Light gray for axis text
          callback: (value) => `$${value}`
        },
        grid: { 
          color: 'rgba(255, 255, 255, 0.1)' // Subtle white grid
        }
      },
      x: {
        ticks: { 
          color: '#e2e8f0' // Light gray for axis text
        },
        grid: { 
          color: 'rgba(255, 255, 255, 0.1)' // Subtle white grid
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div className="chart-container" style={{ padding: '20px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Chart;