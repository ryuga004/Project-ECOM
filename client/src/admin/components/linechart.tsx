
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    CategoryScale,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register({
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
});


interface PropsType {
    MonthData?: Array<number>
}

const LineChart = ({ MonthData }: PropsType) => {
    const LineChartData = {
        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        datasets: [
            {
                label: "Sales",
                data: MonthData,
                borderColor: "lightgreen",
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                    },
                    color: '#333',
                },
            },
            title: {
                display: true,
                text: 'Monthly Sales Data',
                font: {
                    size: 18,
                },
                color: '#333',
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleFont: {
                    size: 16,
                },
                bodyFont: {
                    size: 14,
                },
                footerFont: {
                    size: 12,
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Month',
                    font: {
                        size: 14,
                    },
                    color: '#333',
                },
                ticks: {
                    color: '#333',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Sales',
                    font: {
                        size: 14,
                    },
                    color: '#333',
                },
                ticks: {
                    color: '#333',
                },
            },
        },
    };
    return (
        <div className="ChartContainer LineChartContainer">
            <Line options={options} data={LineChartData} />
        </div>
    )
}

export default LineChart