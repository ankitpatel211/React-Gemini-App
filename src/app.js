import { useState } from "react";

const App = () => {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const [chatHistory, setChatHistory] = useState([])

  const surpriseOptions = [
    "Who won the latest novel peace prize?",
    "Where does the pizza come from?",
    "Who do you make a BLT sandwich?"
  ]

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
    setValue(randomValue)
  }

  const getResponse = async () => {
    if (!value) {
      setError("Error: Please ask a question!")
      return
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value,
          history: chatHistory
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }
      console.log(JSON.stringify(options.body))
      const response = await fetch('http://localhost:8000/gemini', options)
      const data = await response.text()
      setChatHistory(oldChatHistory => [...oldChatHistory, 
        {
          role: "User",
          parts: value
        }, 
        {
          role: "Gemini",
          parts: data 
        }
      ])
      console.log(JSON.stringify(chatHistory))
      setValue("")
    } catch (error) {
      console.error(error)
      setError("Something went wrong! Please try again later.") 
    }
  }

  const clear = () => {
    setValue("")
    setError("")
    setChatHistory([])
  }


  return (
    <div className="app">
      <p>
        What do you want to know?
        <button className="surprise" onClick={surprise} disabled={!chatHistory}>
          Surprise Me
        </button>
        <button className="surprise" onClick={clear}>
          Clear
        </button>
      </p>
      <div className="input-container">
        <input
          value={value}
          placeholder="When is my favorite festival?..."
          onChange={(e) => setValue(e.target.value)}
        />
        {!error && <button onClick={getResponse}>Ask me</button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {error && <p>{error}</p>}
      <div className="search-result">
        {
          chatHistory.map(
            (chatItem, _index) => 
              <div key={_index}>
                <p className="answer"><b>{chatItem.role}:</b> {chatItem.parts}</p>
              </div>
          )
        }
      </div>
    </div>
  );
}

export default App;
