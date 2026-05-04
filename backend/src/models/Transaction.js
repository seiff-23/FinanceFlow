const mongoose = require('mongoose');

const EXPENSE_CATEGORIES = [
  'Alimentaire',
  'Transport',
  'Logement',
  'Loisirs',
  'Santé',
  'Shopping',
  'Factures',
  'Restaurants',
  'Autre',
];

const INCOME_CATEGORIES = [
  'Salaire',
  'Freelance',
  'Cadeau',
  'Investissement',
  'Autre',
];

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Le montant est requis'],
      min: [0.01, 'Le montant doit être positif'],
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Le type est requis'],
    },
    category: {
      type: String,
      required: [true, 'La catégorie est requise'],
      validate: {
        validator: function (val) {
          const all = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
          return all.includes(val);
        },
        message: 'Catégorie invalide',
      },
    },
    date: {
      type: Date,
      required: [true, 'La date est requise'],
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [200, 'La note ne peut dépasser 200 caractères'],
      default: '',
    },
  },
  { timestamps: true }
);

// Index pour les requêtes fréquentes
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });

transactionSchema.statics.EXPENSE_CATEGORIES = EXPENSE_CATEGORIES;
transactionSchema.statics.INCOME_CATEGORIES = INCOME_CATEGORIES;

module.exports = mongoose.model('Transaction', transactionSchema);
