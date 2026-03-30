import { useEffect, useState } from "react"

function useCurrencyInfo(currency){
    /*Tum ek state bana rahe ho:data → currency rates store karega
                                       setData → usko update karega
                                       initial value = {} (empty object)
    */
    const [data,setData] = useState({})
    //jab hook load hoga ya jab koi use krega, tab call karwau toh yea kaam aega
    useEffect( ()=>{
        async function fetchData() {
            try{
                const res = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`)
                const result = await res.json()
                console.log(result)
                console.log(result[currency])
                setData(result[currency]);
            }catch(error){
                console.log("error fatching currency:", error)
            }
        } 
        if(currency){
            fetchData();
        }
    },[currency]);
    console.log(data)

    return data
    
}

export default useCurrencyInfo;