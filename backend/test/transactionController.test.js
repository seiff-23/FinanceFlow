const test = require('node:test');
const assert = require('node:assert/strict');
const Transaction = require('../src/models/Transaction');
const { getTransactions, getStats } = require('../src/controllers/transactionController');

function response() {
  return { statusCode: 200, body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; } };
}

function database(t, records) {
  t.mock.method(Transaction, 'find', (filter) => {
    let selected = records.filter((row) => {
      if (row.user !== filter.user) return false;
      const range = filter.date;
      if (!range) return true;
      return row.date >= range.$gte &&
        (range.$lt === undefined || row.date < range.$lt) &&
        (range.$lte === undefined || row.date <= range.$lte);
    });
    const query = {
      sort() { selected = [...selected].sort((a, b) => b.date - a.date); return query; },
      limit(size) { selected = selected.slice(0, size); return query; },
      then(resolve, reject) { return Promise.resolve(selected).then(resolve, reject); },
    };
    return query;
  });
}

test('monthly filters include the last millisecond, exclude the next month and other users', async (t) => {
  database(t, [
    { _id: 'last', user: 'owner', date: new Date(2026, 1, 28, 23, 59, 59, 999) },
    { _id: 'next', user: 'owner', date: new Date(2026, 2, 1) },
    { _id: 'private', user: 'other', date: new Date(2026, 1, 1) },
  ]);
  const res = response();
  await getTransactions({ user: { _id: 'owner' }, query: { month: '2', year: '2026' } }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.transactions.map((row) => row._id), ['last']);
});

test('yearly filters include December 31 at 23:59:59.999 and exclude January 1', async (t) => {
  database(t, [
    { _id: 'last', user: 'owner', date: new Date(2026, 11, 31, 23, 59, 59, 999) },
    { _id: 'next', user: 'owner', date: new Date(2027, 0, 1) },
  ]);
  const res = response();
  await getTransactions({ user: { _id: 'owner' }, query: { year: '2026' } }, res);
  assert.deepEqual(res.body.transactions.map((row) => row._id), ['last']);
});

test('dashboard monthly totals and chart include transactions at the end of the month', async (t) => {
  const now = new Date();
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  database(t, [{ _id: 'last', user: 'owner', date: last, type: 'income', amount: 25 }]);
  const res = response();
  await getStats({ user: { _id: 'owner' } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.monthIncome, 25);
  assert.equal(res.body.sixMonthsData[5].income, 25);
});
