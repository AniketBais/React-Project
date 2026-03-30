import React, { useId } from 'react'

function InputBox({
  label,
  amount,
  onAmountChange,
  onCurrencyChange,
  currencyOptions = [],
  selectCurrency = "usd",
  amountDisable = false,
  currencyDisable = false,
  className = ""
}) {
  const amountInputId = useId()
  //The useId hook is a built-in hook in React that helps you generate unique IDs for elements in your components

  // 🔹 Format value for display (only for disabled input)
  const displayValue = () => {
    if (amount === 0 || amount === "") return ""

    if (amountDisable) {
      return Number(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    }

    return amount
  }

  // 🔹 Handle typing (only numbers + one decimal)
      const handleChange = (e) => {
      let value = e.target.value

    // remove invalid characters
      value = value.replace(/[^0-9.]/g, "")

    // allow only one decimal point
        const parts = value.split(".")
        if (parts.length > 2) {
          value = parts[0] + "." + parts[1]
        }

        if (onAmountChange) {
          onAmountChange(value === "" ? "" : Number(value))
        }
  }

  // 🔹 Prevent invalid key press
      const handleKeyDown = (e) => {
        const allowedKeys = [
          "Backspace",
          "Delete",
          "ArrowLeft",
          "ArrowRight",
          "Tab",
        ]

        if (!/[0-9.]/.test(e.key) && !allowedKeys.includes(e.key)) {
          e.preventDefault()
        }
      }

  // 🔹 Clear 0 on focus
      const handleFocus = () => {
        if (amount === 0 && onAmountChange) {
          onAmountChange("")
        }
      }
  return (
    <div className={`bg-white p-3 rounded-lg text-sm flex ${className}`}>
      <div className='w-1/2'>
        <label htmlFor={amountInputId} className='text-black/40 mb-2 inline-block'>{label}</label>
        {/* <input type="text"
               id={amountInputId}
               placeholder='Amount'
               disabled = {amountDisable}
               value={
                  amount === 0 || amount === ""
                    ? ""
                    : amountDisable
                    ? Number(amount).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })
                    : amount
                }
               onFocus={() => { if (amount === 0 && onAmountChange) {onAmountChange("") }}}
               onChange={(e)=> onAmountChange && onAmountChange(e.target.value === ""? "":Number(e.target.value))}
               className='outline-none w-full bg-transparent py-1.5'
        /> */}
        <input
          type="text"
          id={amountInputId}
          placeholder="Amount"
          disabled={amountDisable}
          inputMode="decimal"
          value={displayValue()}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          className="outline-none w-full bg-transparent py-1.5"
        />
      </div>
      {/* Currency Section */}
      <div className='w-1/2 flex flex-col items-end text-right overflow-hidden'>
        <p className='text-black/40 mb-2 w-full'>Currency Type</p>
        <select
          className='w-full max-w-30 rounded-lg px-2 py-2 bg-gray-100 cursor-pointer outline-none text-sm truncate shadow-sm hover:bg-gray-200 transition-all'
          value={selectCurrency}
          onChange={(e) => onCurrencyChange && onCurrencyChange(e.target.value)}
          disabled={currencyDisable}
        >
          {currencyOptions.map((currency) => (
            <option key={currency} value={currency}>{currency.toUpperCase()}</option>
          ))}
        </select>

      </div>

    </div>
  );
}

export default InputBox;
