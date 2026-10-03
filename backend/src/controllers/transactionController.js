const Transaction = require('../models/Transaction');

// GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const { month, year, search } = req.query;
    const filter = { user: req.user._id };

    if (month && year) {
      const start = new Date(Number(year), Number(month) - 1, 1);
      const end = new Date(Number(year), Number(month), 1);
      filter.date = { $gte: start, $lt: end };
    } else if (year) {
      const start = new Date(Number(year), 0, 1);
      const end = new Date(Number(year) + 1, 0, 1);
      filter.date = { $gte: start, $lt: end };
    }

    if (search) {
      filter.note = { $regex: search, $options: 'i' };
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// GET /api/transactions/stats
const getStats = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 1);

    // Stats du mois courant
    const monthTransactions = await Transaction.find({
      user: req.user._id,
      date: { $gte: startOfMonth, $lt: endOfMonth },
    });

    let monthIncome = 0;
    let monthExpense = 0;
    const categoryTotals = {};

    monthTransactions.forEach((t) => {
      if (t.type === 'income') {
        monthIncome += t.amount;
      } else {
        monthExpense += t.amount;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      }
    });

    // Évolution sur 6 derniers mois
    const sixMonthsData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1 - i, 1);
      const mStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1);

      const mTransactions = await Transaction.find({
        user: req.user._id,
        date: { $gte: mStart, $lt: mEnd },
      });

      let mIncome = 0;
      let mExpense = 0;
      mTransactions.forEach((t) => {
        if (t.type === 'income') mIncome += t.amount;
        else mExpense += t.amount;
      });

      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      sixMonthsData.push({
        month: monthNames[d.getMonth()],
        income: mIncome,
        expense: mExpense,
      });
    }

    // Total général
    const allTransactions = await Transaction.find({ user: req.user._id });
    let totalBalance = 0;
    allTransactions.forEach((t) => {
      if (t.type === 'income') totalBalance += t.amount;
      else totalBalance -= t.amount;
    });

    // Dernières 5 transactions
    const latest = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(5);

    res.json({
      monthIncome,
      monthExpense,
      totalBalance,
      categoryTotals: Object.entries(categoryTotals).map(([name, value]) => ({ name, value })),
      sixMonthsData,
      latestTransactions: latest,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// POST /api/transactions
const createTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, note } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({ message: 'Montant, type et catégorie sont requis.' });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      amount: Number(amount),
      type,
      category,
      date: date || new Date(),
      note: note || '',
    });

    res.status(201).json({ transaction });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création', error: error.message });
  }
};

// PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction introuvable.' });
    }

    const { amount, type, category, date, note } = req.body;
    if (amount !== undefined) transaction.amount = Number(amount);
    if (type) transaction.type = type;
    if (category) transaction.category = category;
    if (date) transaction.date = date;
    if (note !== undefined) transaction.note = note;

    await transaction.save();
    res.json({ transaction });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
};

// DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction introuvable.' });
    }

    res.json({ message: 'Transaction supprimée.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};

module.exports = {
  getTransactions,
  getStats,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
