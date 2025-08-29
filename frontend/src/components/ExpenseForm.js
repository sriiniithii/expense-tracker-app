import React, { useState } from 'react';

const ExpenseForm = ({ onAddExpense }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    description: ''
  });

  const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Other'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddExpense({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    
    // Reset form
    setFormData({
      title: '',
      amount: '',
      category: 'Food',
      description: ''
    });
  };

  return (
    <div className="expense-form-container">
      <h3>Add New Expense</h3>
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-row">
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Lunch at restaurant"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Amount:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label>Description (optional):</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Additional notes about this expense..."
            rows="3"
          />
        </div>
        
        <button type="submit" className="add-expense-btn">
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;