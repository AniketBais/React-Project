import useCurrencyInfo from "./hooks/useCurrencyInfo"
import InputBox from "./components/InputBox"
import { useState, useEffect } from "react"

function App() {
  const [amount, setAmount] = useState(0)
  const [from, setFrom] = useState("usd")
  const [to, setTo] = useState("inr")
  const [convertedAmount, setConvertedAmount] = useState(0)
  const currencyInfo = useCurrencyInfo(from)
  
  const options = Object.keys(currencyInfo || {})

  const swap = () =>{
    setFrom(to)
    setTo(from)
    setAmount(convertedAmount)
    setConvertedAmount(amount)
    
  }

    const convert = () => {
      if (currencyInfo[to]) {
        setConvertedAmount(amount * currencyInfo[to].toFixed(2))
      }
    }
      // useEffect(() => {
      //   if (currencyInfo[to]) {
      //     setConvertedAmount(amount * currencyInfo[to].toFixed(2))
      //   }
      // }, [amount, from, to, currencyInfo])

    const BackgroundImage = "https://images.pexels.com/photos/4695995/pexels-photo-4695995.jpeg"
   return (
        <div
            className="w-full h-screen flex flex-wrap justify-center items-center bg-cover bg-no-repeat"
            style={{
                backgroundImage: `url('${BackgroundImage}')`,
            }}
        >
            <div className="w-full">
                <div className="w-full max-w-md mx-auto border border-gray-200 rounded-xl p-5 backdrop-blur-lg bg-white/40 shadow-lg">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            convert()
                           
                        }}
                    >
                        <div className="w-full mb-1">
                            <InputBox
                                label="From"
                                amount = {amount}
                                currencyOptions = {options}
                                onCurrencyChange = {(currency)=> setFrom(currency)}
                                selectCurrency = {from} 
                                onAmountChange={(amount)=> setAmount(amount)}
                            />
                        </div>
                        <div className="relative w-full h-0.5">
                            <button
                                type="button"
                                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-xs shadow-md cursor-pointer"
                                onClick={swap}
                            >
                                swap
                            </button>
                        </div>
                        <div className="w-full mt-1 mb-4">
                            <InputBox
                                label="To"
                                amount = {convertedAmount}
                                currencyOptions = {options}
                                onCurrencyChange = {(currency)=>setTo(currency)}
                                selectCurrency = {to}
                                amountDisable
                             />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white px-4 py-3 rounded-lg shadow-md cursor-pointer">
                            Convert {from.toUpperCase()} to {to.toUpperCase()} 
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App
