export function calculateBalances(expenses) {
const balances = {};


expenses.forEach(exp => {
balances[exp.payer_id] = (balances[exp.payer_id] || 0) + parseFloat(exp.total);


exp.expense_shares?.forEach(share => {
balances[share.user_id] = (balances[share.user_id] || 0) - parseFloat(share.share);
});
});


return balances;
}