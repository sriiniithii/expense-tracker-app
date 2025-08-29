const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all expenses for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId })
      .sort({ date: -1 }); // Newest first
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new expense
router.post('/', auth, async (req, res) => {
  try {
    const expense = new Expense({
      ...req.body,
      user: req.userId
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update expense
router.put('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get expenses analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId });
    
    // Calculate total spending
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Group by category
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
    
    // Monthly spending (current month)
    const currentMonth = new Date();
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthExpenses = expenses.filter(expense => 
      new Date(expense.date) >= monthStart
    );
    const monthlyTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    res.json({
      totalSpent,
      categoryTotals,
      monthlyTotal,
      expenseCount: expenses.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;