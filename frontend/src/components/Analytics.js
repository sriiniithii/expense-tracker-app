import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Analytics = ({ analytics }) => {
  const { categoryTotals = {} } = analytics;

  // Prepare data for pie chart
  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4CAF50',
          '#FF9800',
          '#9C27B0',
          '#607D8B'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4CAF50',
          '#FF9800',
          '#9C27B0',
          '#607D8B'
        ]
      }
    ]
  };

  // Prepare data for bar chart
  const barData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: 'Amount Spent ($)',
        data: Object.values(categoryTotals),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  if (Object.keys(categoryTotals).length === 0) {
    return (
      <div className="analytics-container">
        <h3>Analytics Dashboard</h3>
        <div className="no-data">
          <p>No expense data available for analytics. Start adding expenses to see your spending patterns!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <h3>Analytics Dashboard</h3>
      
      <div className="analytics-summary">
        <div className="summary-card">
          <h4>Top Spending Category</h4>
          <p className="highlight">
            {Object.keys(categoryTotals).reduce((a, b) => 
              categoryTotals[a] > categoryTotals[b] ? a : b
            )}
          </p>
          <span className="amount">
            ${Math.max(...Object.values(categoryTotals)).toFixed(2)}
          </span>
        </div>
        
        <div className="summary-card">
          <h4>Average per Category</h4>
          <p className="highlight">
            ${(Object.values(categoryTotals).reduce((a, b) => a + b, 0) / Object.keys(categoryTotals).length).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-section">
          <h4>Spending by Category (Pie Chart)</h4>
          <div className="chart">
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-section">
          <h4>Spending by Category (Bar Chart)</h4>
          <div className="chart">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="category-breakdown">
        <h4>Category Breakdown</h4>
        <div className="category-list">
          {Object.entries(categoryTotals)
            .sort(([,a], [,b]) => b - a)
            .map(([category, amount]) => (
              <div key={category} className="category-item">
                <span className="category-name">{category}</span>
                <span className="category-amount">${amount.toFixed(2)}</span>
                <div className="category-bar">
                  <div 
                    className="category-progress" 
                    style={{
                      width: `${(amount / Math.max(...Object.values(categoryTotals))) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default Analytics;