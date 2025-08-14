import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/logged/all`;

const HomePage = () => {
  const [timeRange] = useState('Last 24 Hours');
  const [stats, setStats] = useState({
    totalExecutions: 0,
    successCount: 0,
    failureCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ timeRange: timeRange.toLowerCase().replace(' ', '_') });
        const resp = await fetch(`${URL}?${params}`);
        if (!resp.ok) throw new Error('Network error');
        const data = await resp.json();
        // console.log(data,"data from api")
        setStats({
          totalExecutions: data.all_data || 0,
          successCount: data.success_data || 0,
          failureCount: data.failure_data || 0,
        });
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [timeRange]);

  const chartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    datasets: [
      {
        label: 'Success',
        data: [100, 150, 200, 180, 220, 210, 200],
        borderColor: 'rgb(34,197,94)',
        backgroundColor: 'rgba(34,197,94,0.2)',
        tension: 0.4,
      },
      {
        label: 'Failure',
        data: [10, 15, 20, 18, 22, 21, 20],
        borderColor: 'rgb(239,68,68)',
        backgroundColor: 'rgba(239,68,68,0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Interface Execution Trends (Last 24 Hours)' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Executions' } },
      x: { title: { display: true, text: 'Time of Day' } },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">

        {/* Page Introduction */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome to DataFlow</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            This dashboard provides real-time insights into your system interfaces. Track execution metrics,
            monitor integration health, and visualize trends over time. The goal is to help you identify issues early and ensure
            smooth data flow between systems.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-700">Total Executions</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {loading ? 'Loading...' : stats.totalExecutions.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-700">Success Count</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {loading ? 'Loading...' : stats.successCount.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-700">Failure Count</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {loading ? 'Loading...' : stats.failureCount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-12">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Execution Trends</h2>
            <p className="text-gray-600 text-sm">
              This chart shows how interface executions fluctuate throughout the day. Use it to understand peak load times and identify anomalies.
            </p>
          </div>
          <div className="h-64 sm:h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">&copy; 2025 DataFlow. All rights reserved.</p>
            <div className="mt-4 md:mt-0 space-x-4">
              <Link to="/signup" className="text-sm hover:text-indigo-300">Register</Link>
              <Link to="/" className="text-sm hover:text-indigo-300">Contact</Link>
              <Link to="/" className="text-sm hover:text-indigo-300">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      {loading && !error && <div className="text-center py-4">Loading...</div>}
    </div>
  );
};

export default HomePage;
