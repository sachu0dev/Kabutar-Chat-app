import { Line, Doughnut } from "react-chartjs-2";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import {
  orange,
  purpleColor,
  purpleColor2,
  purpleColorLight,
  purpleColorLight2,
} from "../../constants/color";
import { getLast7Days } from "../../lib/features";

ChartJS.register(
  CategoryScale,
  Tooltip,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  ArcElement,
  Legend
);

const labels = getLast7Days();
const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const LineChart = ({ value = [] }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        data: value,
        label: "Revenue",
        fill: true,
        backgroundColor: "rgba(75, 12, 192, 0.5)",
        borderColor: purpleColor,
      },
    ],
  };
  return <Line data={data} options={lineChartOptions} />;
};

const DoughnutChart = ({ value = [], labels = [] }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        data: value,
        fill: true,
        backgroundColor: [purpleColorLight, purpleColorLight2],
        borderColor: [purpleColor, purpleColor2],
        offset: 40,
      },
    ],
  };
  return <Doughnut data={data} style={{ zIndex: 1 }} />;
};

export { LineChart, DoughnutChart };
