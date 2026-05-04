const mongoose = require('mongoose');

const categoryBudgetSchema = new mongoose.Schema({
  category: { type: String, required: true },
  limit: { type: Number, required: true, min: 0 },
});

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    globalLimit: {
      type: Number,
      default: 0,
      min: 0,
    },
    categoryBudgets: [categoryBudgetSchema],
  },
  { timestamps: true }
);

// Un seul budget par utilisateur/mois/année
budgetSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
