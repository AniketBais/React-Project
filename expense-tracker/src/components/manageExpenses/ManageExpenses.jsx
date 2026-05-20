import React, { useContext, useState } from 'react'
import { UserContext } from '../../auth/UserContext'

function ManageExpenses() {
  const { user, loading, setUser } = useContext(UserContext)
  const [darkMode, setDarkMode] = useState(true)
  const [incomeInput, setIncomeInput] = useState('')
  const [expenseName, setExpenseName] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Food")
  const [date, setDate] = useState("")
  const [formError, setFormError] = useState("")
  const [incomeError, setIncomeError] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const pageTheme = darkMode
    ? "bg-slate-950 text-white"
    : "bg-slate-100 text-slate-950";

  const cardTheme = darkMode
    ? "bg-slate-900 border-slate-800"
    : "bg-white border-slate-200";

  const mutedText = darkMode
    ? "text-slate-400"
    : "text-slate-600";

  const themeButton = darkMode
    ? "bg-amber-300 text-slate-950 hover:bg-amber-200"
    : "bg-slate-950 text-white hover:bg-slate-800";

  const inputTheme = darkMode
    ? "bg-slate-950 text-white border-slate-800 placeholder-slate-500 focus:border-emerald-500"
    : "bg-slate-50 text-slate-950 border-slate-300 placeholder-slate-400 focus:border-emerald-500";

  const income = user?.income || 0;
  const balance = user?.balance || 0;
  const totalExpense = user?.totalExpense || 0;
  const totalRecords = user?.expenses?.length || 0;

  //Income Function 
  function handleSaveIncome() {
    if (!incomeInput || Number(incomeInput) <= 0) {
      setIncomeError("Please enter a valid income amount.");
      return;
    }

    const addedIncome = Number(incomeInput);

    const updatedIncome = income + addedIncome;
    const updatedBalance = balance + addedIncome;

    const updatedUser = {
      ...user,
      income: updatedIncome,
      balance: updatedBalance,
    };

    const savedUsers = JSON.parse(localStorage.getItem("users"));
    const users = Array.isArray(savedUsers) ? savedUsers : [];

    const updatedUsers = users.map((item) =>
      item.name === user.name ? updatedUser : item
    );

    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setUser(updatedUser);
    setIncomeInput("");
    setIncomeError("");
  }

  //Handle Expenses
  function handleExpense(e) {
    e.preventDefault();

    if (!expenseName || !amount || !category || !date) {
      setFormError("Please fill all expense fields.");
      return;
    }

    if (Number(amount) <= 0) {
      setFormError("Please enter a valid expense amount.");
      return;
    }

    const oldExpenseAmount =
      editIndex === null ? 0 : Number(user.expenses[editIndex].amount);

    const availableBalance =
      editIndex === null ? balance : balance + oldExpenseAmount;

    if (Number(amount) > availableBalance) {
      setFormError("You do not have enough balance.");
      return;
    }

    const newExpense = {
      expenseName,
      amount: Number(amount),
      category,
      date,
    };

    let updatedExpenses;
    let updatedTotalExpense;
    let updatedBalance;

    if (editIndex === null) {
      updatedExpenses = [...(user?.expenses || []), newExpense];
      updatedTotalExpense = totalExpense + Number(amount);
      updatedBalance = balance - Number(amount);
    } else {
      const oldExpense = user.expenses[editIndex];

      updatedExpenses = user.expenses.map((expense, index) =>
        index === editIndex ? newExpense : expense
      );

      updatedTotalExpense =
        totalExpense - Number(oldExpense.amount) + Number(amount);

      updatedBalance =
        balance + Number(oldExpense.amount) - Number(amount);
    }

    const updatedUser = {
      ...user,
      expenses: updatedExpenses,
      totalExpense: updatedTotalExpense,
      balance: updatedBalance,
    };

    const savedUsers = JSON.parse(localStorage.getItem("users"));
    const users = Array.isArray(savedUsers) ? savedUsers : [];

    const updatedUsers = users.map((item) =>
      item.name === user.name ? updatedUser : item
    );

    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setUser(updatedUser);

    setExpenseName("");
    setAmount("");
    setCategory("Food");
    setDate("");
    setFormError("");
    setEditIndex(null);
  }

  //Delete Expenses
  function handleDeleteExpense(indexToDelete) {
    const selectedExpense = user.expenses[indexToDelete];

    const updatedExpenses = user.expenses.filter(
      (_, index) => index !== indexToDelete
    );

    const updatedTotalExpense = totalExpense - Number(selectedExpense.amount);
    const updatedBalance = balance + Number(selectedExpense.amount);

    const updatedUser = {
      ...user,
      expenses: updatedExpenses,
      totalExpense: updatedTotalExpense,
      balance: updatedBalance,
    };

    const savedUsers = JSON.parse(localStorage.getItem("users"));
    const users = Array.isArray(savedUsers) ? savedUsers : [];

    const updatedUsers = users.map((item) =>
      item.name === user.name ? updatedUser : item
    );

    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setUser(updatedUser);
  }

  //Edit Expenses
  function handleEditExpense(indexToEdit) {
    const selectedExpense = user.expenses[indexToEdit]

    setExpenseName(selectedExpense.expenseName)
    setAmount(selectedExpense.amount)
    setCategory(selectedExpense.category)
    setDate(selectedExpense.date)

    setEditIndex(indexToEdit)
    setFormError("")
  }

  //handle Cancel Edit
  function handleCancelEdit() {
    setExpenseName("")
    setAmount("")
    setCategory("Food")
    setDate("")
    setFormError("")
    setEditIndex(null)
  }

  function formatDate(dateValue) {
    if (!dateValue) return "";

    const [year, month, day] = dateValue.split("-");
    return `${day}/${month}/${year}`;
  }
  if (loading) {
    return (
      <div>
        Loading...
      </div>
    )
  }
  return (
    <div className={`min-h-screen px-4 py-6 sm:px-6 lg:px-10 transition-all duration-300 ${pageTheme}`}
    >
      {/*user name */}
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-2xl sm:text-4xl font-extrabold'>Manage EXPENSES</h1>
        <p className={`${mutedText} mt-2`}>
          Welcome Back, {" "}
          <span className='text-amber-300 font-semibold'>
            {user?.name || "Student"}
          </span>
        </p>
      </div>

      {/* Balance Section UI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className={`rounded-2xl p-5 border shadow-lg ${cardTheme}`}>
          <p className={`${mutedText} text-sm`}>Income</p>
          <h2 className="text-3xl font-bold text-emerald-400 mt-2">
            ₹ {income.toLocaleString()}
          </h2>
        </div>

        <div className={`rounded-2xl p-5 border shadow-lg ${cardTheme}`}>
          <p className={`${mutedText} text-sm`}>Balance</p>
          <h2 className="text-3xl font-bold text-amber-400 mt-2">
            ₹ {balance.toLocaleString()}
          </h2>
        </div>

        <div className={`rounded-2xl p-5 border shadow-lg ${cardTheme}`}>
          <p className={`${mutedText} text-sm`}>Total Expense</p>
          <h2 className="text-3xl font-bold text-red-400 mt-2">
            ₹ {totalExpense.toLocaleString()}
          </h2>
        </div>

        <div className={`rounded-2xl p-5 border shadow-lg ${cardTheme}`}>
          <p className={`${mutedText} text-sm`}>Records</p>
          <h2 className="text-3xl font-bold text-sky-400 mt-2">
            {totalRecords}
          </h2>
        </div>
      </div>


      {/*ADD Income section UI*/}

      <div className={`mt-8 rounded-2xl p-5 border shadow-lg ${cardTheme}`}>
        <h2 className="text-xl font-bold mb-4">Add Income</h2>
        <div className='flex flex-col sm:flex-row gap-3'>
          <input
            type="number"
            value={incomeInput}
            onChange={(e) => setIncomeInput(e.target.value)}
            placeholder='Enter Credited Income'
            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${inputTheme}`}
          />
          {incomeError && (
            <p className="text-red-400 text-sm font-semibold">{incomeError}</p>
          )}
          <button
            type="button"
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all"
            onClick={handleSaveIncome}
          >
            Save Income
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
        {/*Add Expense Form*/}
        <div className={`lg:col-span-2 rounded-2xl p-5 border shadow-lg ${cardTheme}`}>
          <h2 className="text-xl font-bold mb-4">
            {editIndex === null ? "Add Expense" : "Update Expense"}
          </h2>
          <form className='grid grid-cols-1 gap-4' onSubmit={handleExpense}>
            <div>
              <label className={`${mutedText} text-sm`}>Expense Name</label>
              <input
                type="text"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                placeholder='Example: Lunch'
                className={`mt-1 w-full px-4 py-3 rounded-xl border outline-none transition-all ${inputTheme}`}
              />
            </div>
            <div>
              <label className={`${mutedText} text-sm`}>Amount</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Example: 250"
                className={`mt-1 w-full px-4 py-3 rounded-xl border outline-none transition-all ${inputTheme}`}
              />
            </div>
            <div>
              <label className={`${mutedText} text-sm`}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`mt-1 w-full px-4 py-3 rounded-xl border outline-none transition-all ${inputTheme}`}

              >
                <option>Food</option>
                <option>Travel</option>
                <option>Education</option>
                <option>Shopping</option>
                <option>Bills</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className={`${mutedText} text-sm`}>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`mt-1 w-full px-4 py-3 rounded-xl border outline-none transition-all ${inputTheme}`}
              />
            </div>
            {formError && (
              <p className="text-red-400 text-sm font-semibold">
                {formError}
              </p>
            )}
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl transition-all"
            >
              {editIndex === null ? "Add Expense" : "Update Expense"}
            </button>

            {editIndex !== null && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-3 rounded-xl transition-all"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/*Expenses List UI */}
        <div className={`lg:col-span-3 rounded-2xl p-5 border shadow-lg ${cardTheme}`}>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4'>
            <h2 className={`text-xl font-bold`}>Expense List</h2>
            <span className={`${mutedText} text-sm`}>
              {totalRecords} records
            </span>
          </div>
          {user?.expenses?.length === 0 ? (
            <div className={`rounded-xl border border-dashed p-8 text-center ${mutedText}`}>
              No expenses added yet.
            </div>
          ) : (<div className='space-y-3'>
            {user.expenses.map((expense, index) => (
              <div key={index}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border p-4 ${cardTheme}`}>
                <div>
                  <h3 className='font-bold text-lg'>{expense.expenseName}</h3>
                  <p className={`${mutedText} text-sm`}>
                    {expense.category} * {formatDate(expense.date)}
                  </p>
                </div>
                <div className='flex items-center justify-between sm:justify-end gap-3'>
                  <strong className='text-red-400 text-lg'>
                    ₹ {Number(expense.amount).toLocaleString()}
                  </strong>
                  <button
                    type="button"
                    onClick={() => handleEditExpense(index)}
                    className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg transition-all"
                  >
                    Edit
                  </button>
                  <button
                    type='button'
                    className='bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg transition-all'
                    onClick={() => handleDeleteExpense(index)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>)}
        </div>
      </div>

      {/* Dark Mode button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed bottom-5 right-5 px-5 py-3 rounded-full font-bold shadow-xl transition-all duration-300
        ${themeButton}`}>
        {darkMode ? "Light-Mode 💡" : "Dark-Mode 🌛"}
      </button>
    </div>
  )
}

export default ManageExpenses