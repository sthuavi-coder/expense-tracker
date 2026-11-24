import "server-only";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";


const expensesFile = path.join(process.cwd(), "data", "expenses.json");
const budgetsFile = path.join(process.cwd(), "data", "budgets.json");


export async function getExpenses() {
    const text = await readFile(expensesFile, "utf8");
    const expenses =  JSON.parse(text);
    return expenses.sort((a, b) => b.date.localeCompare(a.date))
}

export async function saveExpenses(expenses) {
    await writeFile(expensesFile, JSON.stringify(expenses, null, 2));
}

export async function getExpense(id) {
    const expenses = await getExpenses();
    return expenses.find((expense) => expense.id === id)
}

export async function createExpense({ title, amount, category, date }) {
    const expenses = await getExpenses();
    const expense = { id: crypto.randomUUID(), title: title.trim(), amount, category, date};
    await saveExpenses([...expenses, expense]);
    return expense;
}

export async function updateExpense(id, { title, amount, category, date }) {
    const expenses = await getExpenses();
    const expense = expenses.find((expense) => expense.id === id);
    if (!expense) return null;

    const updated = { ...expense, title: title.trim(), amount, category, date};
    await saveExpenses(expenses.map((expense) => (expense.id === id ? updated : expense)));
    return updated;
}

export async function deleteExpense(id) {
    const expenses = await getExpenses();
    const remaining = expenses.filter((expense) => expense.id !== id);
    if (remaining.length === expenses.length) return false;

    await saveExpenses(remaining);
    return true;
}

export async function getBudgets() {
    const text = await readFile(budgetsFile, "utf8");
    return JSON.parse(text)
}