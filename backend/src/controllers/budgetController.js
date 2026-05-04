const Budget = require('../models/Budget');

// GET /api/budgets?month=&year=
const getBudget = async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const m = month ? Number(month) : now.getMonth() + 1;
    const y = year ? Number(year) : now.getFullYear();

    const budget = await Budget.findOne({ user: req.user._id, month: m, year: y });
    res.json({ budget: budget || null });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// POST /api/budgets  (upsert)
const saveBudget = async (req, res) => {
  try {
    const { month, year, globalLimit, categoryBudgets } = req.body;

    const now = new Date();
    const m = month ? Number(month) : now.getMonth() + 1;
    const y = year ? Number(year) : now.getFullYear();

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, month: m, year: y },
      {
        user: req.user._id,
        month: m,
        year: y,
        globalLimit: globalLimit || 0,
        categoryBudgets: categoryBudgets || [],
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ budget });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la sauvegarde', error: error.message });
  }
};

module.exports = { getBudget, saveBudget };
