import React from 'react';

const ExpenseList = ({ expenses, onDeleteExpense }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (expenses.length === 0) {
    return (
      <div className="expense-list-container">
        <h3>Your Expenses</h3>
        <div className="no-expenses">
          <p>No expenses yet. Add your first expense above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-list-container">
      <h3>Your Expenses ({expenses.length})</h3>
      <div className="expense-list">
        {expenses.map(expense => (
          <div key={expense._id} className="expense-item">
            <div className="expense-info">
              <div className="expense-header">
                <h4>{expense.title}</h4>
                <span className="expense-amount">${expense.amount.toFixed(2)}</span>
              </div>
              <div className="expense-details">
                <span className="expense-category">{expense.category}</span>
                <span className="expense-date">{formatDate(expense.date)}</span>
              </div>
              {expense.description && (
                <p className="expense-description">{expense.description}</p>
              )}
            </div>
            <button 
              onClick={() => onDeleteExpense(expense._id)}
              className="delete-btn"
              title="Delete expense"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;