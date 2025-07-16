import { useMemo } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);
ChartJS.register(annotationPlugin);

const WeatherChart = ({
  data,
  currentIndex,
}: {
  data: { time: string; temp: number; weather: string }[];
  currentIndex: number;
}) => {
  // 最高気温を取得し、少し余裕を持たせる
  const maxTemp = Math.max(...data.map((d) => d.temp), 0);
  const yMax = Math.ceil(maxTemp + 2); // 2℃余裕を持たせる

  const chartData = useMemo(
    () => ({
      labels: data.map((d) => d.time),
      datasets: [
        {
          label: '気温(℃)',
          data: data.map((d) => d.temp),
          borderColor: 'rgba(255,99,132,1)',
          backgroundColor: 'rgba(255,99,132,0.2)',
          tension: 0.4,
          pointBackgroundColor: data.map((_, i) =>
            i === currentIndex ? 'rgba(255,99,132,1)' : 'rgba(255,99,132,1)'
          ),
          pointRadius: data.map((_, i) => (i === currentIndex ? 10 : 4)),
          pointBorderWidth: data.map((_, i) => (i === currentIndex ? 4 : 1)),
          pointBorderColor: data.map((_, i) =>
            i === currentIndex ? '#ffffff' : 'rgba(255,99,132,1)'
          ),
        },
      ],
    }),
    [data, currentIndex]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          callbacks: {
            title: (ctx) => ctx[0].label,
            label: (ctx) => `気温: ${ctx.parsed.y}℃`,
          },
        },
        annotation: {
          annotations: {
            currentTemp: {
              type: 'label',
              xValue: currentIndex,
              yValue: data[currentIndex].temp,
              backgroundColor: 'rgba(255,255,255,0)',
              color: '#fff',
              borderColor: 'rgb(0, 0, 0)',
              font: { weight: 'bold', size: 14 },
              content: [`${data[currentIndex].temp}℃`],
              yAdjust: -30,
              xAdjust: 0,
              display: true,
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            callback: function (value, index) {
              const d = data[index];
              return d ? [d.weather, d.time] : this.getLabelForValue(value);
            },
            font: { size: 18 },
            color: '#fff',
          },
        },
        y: {
          min: 10,
          max: yMax, // ここを動的に
          title: { display: true, text: '気温(℃)' },
        },
      },
    }),
    [data, currentIndex, yMax]
  );

  return <Line data={chartData} options={chartOptions} />;
};

export default WeatherChart;