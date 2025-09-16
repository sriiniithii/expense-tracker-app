import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import Analytics from './Analytics';

const Dashboard = ({ setIsAuthenticated }) => {
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('expenses');

  // API URL with fallback
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchExpenses();
    fetchAnalytics();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
    setLoading(false);
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/expenses/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const addExpense = async (expenseData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/expenses`, expenseData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses([response.data, ...expenses]);
      fetchAnalytics(); // Refresh analytics
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(expenses.filter(expense => expense._id !== id));
      fetchAnalytics(); // Refresh analytics
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="loading">Loading your expenses...</div>;
  }

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome back, {user?.username}!</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Spent</h3>
          <p className="stat-value">${analytics.totalSpent?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="stat-card">
          <h3>This Month</h3>
          <p className="stat-value">${analytics.monthlyTotal?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="stat-card">
          <h3>Total Expenses</h3>
          <p className="stat-value">{analytics.expenseCount || 0}</p>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'expenses' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('expenses')}
        >
          Expenses
        </button>
        <button 
          className={activeTab === 'analytics' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'expenses' && (
          <div>
            <ExpenseForm onAddExpense={addExpense} />
            <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <Analytics analytics={analytics} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;