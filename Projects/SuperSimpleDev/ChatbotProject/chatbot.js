function App() {
  const [inputText, setInputText] = React.useState("");
  const [messages, setMessages] = React.useState([]);

  function getBotResponse(text) {
    const question = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    let knownQuestion = "";

    if (/^(hi|hello)( chatbot)?$/.test(question)) {
      knownQuestion = "hello";
    } else if (question === "how are you") {
      knownQuestion = "how are you";
    } else if (question === "flip a coin") {
      knownQuestion = "flip a coin";
    } else if (question === "roll a dice") {
      knownQuestion = "roll a dice";
    } else if (
      /^(what is|whats) (the )?(date( today)?|todays date)$/.test(question) ||
      question === "date today"
    ) {
      knownQuestion = "what is the date today";
    } else if (/^(thank|thanks|thank you)$/.test(question)) {
      knownQuestion = "thank";
    }

    if (knownQuestion === "") {
      return Chatbot.unsuccessfulResponse;
    }

    return Chatbot.getResponse(knownQuestion);
  }

  function sendMessage() {
    const text = inputText.trim();
    if (text === "") return;

    const userMessage = {
      id: crypto.randomUUID(),
      text: text,
      sender: "user",
    };
    const thinkingMessage = {
      id: crypto.randomUUID(),
      text: "......",
      sender: "robot",
      isThinking: true,
    };

    setMessages((currentMessages) => [
      thinkingMessage,
      userMessage,
      ...currentMessages,
    ]);
    setInputText("");

    setTimeout(() => {
      const reply = getBotResponse(text);
      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === thinkingMessage.id
            ? { ...message, text: reply, isThinking: false }
            : message,
        ),
      );
    }, 2000);
  }

  return (
    <main className="chatbot">
      <h1>Welcome to AI Bot</h1>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Send a message to Chatbot..."
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <section className="chat-messages" aria-label="Chat messages">
        {messages.map((message) => (
          <div className={`chat-message ${message.sender}`} key={message.id}>
            {message.sender === "robot" && (
              <img src="./Images/robot.png" alt="Robot" width="50" />
            )}
            <span className={message.isThinking ? "thinking" : undefined}>
              {message.text}
            </span>
            {message.sender === "user" && (
              <img src="./Images/user.png" alt="You" width="50" />
            )}
          </div>
        ))}
      </section>
    </main>
  );
}

const container = document.querySelector(".js-container");
ReactDOM.createRoot(container).render(<App />);