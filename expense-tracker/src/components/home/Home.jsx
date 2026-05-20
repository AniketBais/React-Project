import React, { useContext, useState } from "react";
import { UserContext } from "../../auth/UserContext";

function Home() {
  const [darkMode, setDarkMode] = useState(true);
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

  const { user, loading } = useContext(UserContext);
  const [filterCategory, setFilterCategory] = useState("All");

  const expenses = user?.expenses || [];
  const income = user?.income || 0;
  const balance = user?.balance || 0;
  const totalExpense = user?.totalExpense || 0;
  const totalRecords = expenses.length;

  const categories = ["All", "Food", "Travel", "Education", "Shopping", "Bills", "Other"];

  const filteredExpenses =
    filterCategory === "All"
      ? expenses
      : expenses.filter((expense) => expense.category === filterCategory);

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 py-6 sm:px-6 lg:px-10 transition-all duration-300 ${pageTheme}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">
            Student Expense Tracker
          </p>

          <h1 className="text-3xl sm:text-4xl font-extrabold mt-2">
            Dashboard
          </h1>

          <p className={`${mutedText} mt-2`}>
            Welcome back,{" "}
            <span className="text-amber-300 font-semibold">
              {user?.name || "Student"}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className={`border rounded-2xl p-5 shadow-lg ${cardTheme}`}>
            <p className={`${mutedText} text-sm`}>Income</p>
            <h2 className="text-3xl font-bold text-emerald-400 mt-2">
              ₹ {income.toLocaleString()}
            </h2>
          </div>

          <div className={`border rounded-2xl p-5 shadow-lg ${cardTheme}`}>
            <p className={`${mutedText} text-sm`}>Balance</p>
            <h2 className="text-3xl font-bold text-amber-400 mt-2">
              ₹ {balance.toLocaleString()}
            </h2>
          </div>

          <div className={`border rounded-2xl p-5 shadow-lg ${cardTheme}`}>
            <p className={`${mutedText} text-sm`}>Total Expense</p>
            <h2 className="text-3xl font-bold text-red-400 mt-2">
              ₹ {totalExpense.toLocaleString()}
            </h2>
          </div>

          <div className={`border rounded-2xl p-5 shadow-lg ${cardTheme}`}>
            <p className={`${mutedText} text-sm`}>Records</p>
            <h2 className="text-3xl font-bold text-sky-400 mt-2">
              {totalRecords}
            </h2>
          </div>
        </div>

        <div className={`border rounded-2xl p-5 shadow-lg ${cardTheme}`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold">Expense Summary</h2>
              <p className={`${mutedText} text-sm mt-1`}>
                Filter your expenses by category
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    filterCategory === category
                      ? "bg-emerald-500 text-slate-950"
                      : darkMode
                      ? "bg-slate-950 text-slate-300 hover:bg-slate-800"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {filteredExpenses.length === 0 ? (
            <div className={`rounded-xl border border-dashed p-8 text-center ${mutedText} ${
              darkMode ? "border-slate-700" : "border-slate-300"
            }`}>
              No expenses found.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredExpenses.map((expense, index) => (
                <div
                  key={index}
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border rounded-xl p-4 ${
                    darkMode
                      ? "bg-slate-950 border-slate-800"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-lg">{expense.expenseName}</h3>
                    <p className={`${mutedText} text-sm`}>
                      {expense.category} • {expense.date}
                    </p>
                  </div>

                  <strong className="text-red-400 text-lg">
                    ₹ {Number(expense.amount).toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dark Mode button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed bottom-5 right-5 px-5 py-3 rounded-full font-bold shadow-xl transition-all duration-300 ${themeButton}`}
      >
        {darkMode ? "Light-Mode 💡" : "Dark-Mode 🌛"}
      </button>
    </div>
  );
}

export default Home;