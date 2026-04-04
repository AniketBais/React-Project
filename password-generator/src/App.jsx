import { useState,useCallback,useEffect, useRef } from "react"
// useCallback ek function ko same reference ke saath reuse karta hai jab tak dependencies change na ho

// React me har render par functions naye ban jaate hain, jo kabhi-kabhi performance issue create karta hai, especially:
// jab function props ke through child component me pass ho

/*
React me jab component re-render hota hai,
toh har baar function naya ban jata hai 😵
👉 useCallback bolta hai: “Same function ko reuse karo jab tak zarurat na ho”

Kab use kare?
Jab function child component ko pass ho raha ho
Aur unwanted re-render ho raha ho
*/
function App() {
  const [length, setLength] = useState(8)
  const [numberAllowed, setNumberAllowed] = useState(false)
  const [charAllowed, setCharAllowe] = useState(false)
  const [password, setPassword] = useState("")
  const [copied, setCopied] = useState(false)

  //useRef Hook
  const passwordRef = useRef(null)
  const copypPasswordToClipboard = useCallback(()=>{
        passwordRef.current?.select()
        passwordRef.current?.setSelectionRange(0,99)
        window.navigator.clipboard.writeText(password)

        setCopied(true)

        setTimeout(() => {
          setCopied(false)

          // unselect text
          // passwordRef.current?.setSelectionRange(0, 0)
          // passwordRef.current?.blur() // optional (focus hata deta hai)
        }, 1500) // 1.5 sec baad gayab

      },[password])


  const passwordGenerator = useCallback(()=>{
    let pass = ""
    let str = "QWERTYUIOPLKJHGFDSAZXCVBNMpoiuytrewqasdfghjklmnbvcxz"
    if(numberAllowed){
      str += '0987654321'
    }
    if(charAllowed){
      str += '!@#$%^&*()'
    }
    for (let i = 0; i < length; i++) {
      let char = Math.floor(Math.random()*str.length )
      pass += str.charAt(char)
    }

    setPassword(pass)

  },[length,numberAllowed,charAllowed,setPassword])

  useEffect(() => {
      passwordGenerator();
      }, [length, numberAllowed, charAllowed, passwordGenerator]);
  return (
    <>
      <div className="w-full max-w-md mx-auto shadow-md rounded-lg px-5 my-8 min-h-50 text-orange-500 bg-gray-700 text-center">
        <h1 className="text-white text-center text-4xl py-4">Password Generator</h1>
        <div className="flex shadow rounded-lg overflow-hidden mb-4 my-1 ">
          <input 
          type="text"
          value={password}
          className="outline-none w-full py-1 px-3 bg-amber-50"
          placeholder="password"
          readOnly
          ref={passwordRef}
          />
          <button className="outline-none bg-blue-700 text-white px-3 shrink-0 cursor-pointer transition-all duration-200 hover:bg-blue-900 hover:scale-105" onClick={copypPasswordToClipboard}>{copied ? "Copied!" : "Copy"}</button>
        </div>
        <div className="flex text-sm gap-x-2 my-9">
          <div className="flex items-center gap-x-1">
              <input type="range" 
              min={8}
              max={25}
              value={length}
              className="cursor-pointer"
              onChange={(e)=>setLength(e.target.value)}
              
              id="lngth"
              />
              <label htmlFor="lngth">Length: {length}</label>
          </div>
          <div className="flex items-center gap-x-1">
              <input type="checkbox" 
                defaultChecked={numberAllowed}
                id="numberInput"
                onChange={()=>{
                  setNumberAllowed((prev)=>!prev);
                }}
                //prev value jo bhi hai, reverse krdo
              />
              <label htmlFor="numberInput">Numbers</label>
          </div>
          <div className="flex items-center gap-x-1">
                <input type="checkbox"
                  defaultChecked={charAllowed}
                  id="characterInput"
                  onChange={()=>{
                    setCharAllowe((prev)=> !prev)
                  }}
                />
                <label htmlFor="characterInput">Characters</label>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
