import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();
const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextword) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextword);
    }, 75 * index);
  };

  const newChat =()=>{
    setLoading(false);
    setShowResult(false)
  }

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let result; 
    if(prompt !== undefined){
        result= await run(prompt);
        setRecentPrompt(prompt)

    }else{
        setPrevPrompt(prev=>[ ...prev, input])
        setRecentPrompt(input)
        result=await run(input)

    }
   
    let responseArray = result.split("**");
    let newResult = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResult += responseArray[i];
      } else {
        newResult += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newResult2 = newResult.split("*").join("</br>");
    let newResultArray = newResult2.split(" ");
    for (let i = 0; i < newResultArray.length; i++) {
      const nextword = newResultArray[i];
      delayPara(i, nextword + " ");
    }
    setLoading(false);
    setInput("");
  };

  const contextValue = {
    prevPrompt,
    setPrevPrompt,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat
  };
  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
