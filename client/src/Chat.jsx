import { useState, useEffect, useRef } from "react";

function Chat() {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const socketRef = useRef(null);

	useEffect(() => {
		socketRef.current = new WebSocket("ws://localhost:3001");

		socketRef.current.onopen = () => {
			console.log("WebSocket connection established.");
		};

		socketRef.current.onmessage = (event) => {
			const receivedMessage = JSON.parse(event.data);
			setMessages([...messages, receivedMessage]);
		};

		return () => {
			if (socketRef.current.readyState === 1) {
				socketRef.current.close();
			}
		};
	}, [messages]);

	function sendMessage() {
		if (input.trim() !== "") {
			const message = {
				text: input,
				timestamp: new Date().toISOString(),
			};
			socketRef.current.send(JSON.stringify(message));
			setInput("");
		}
	}

	return (
		<div>
			<div
				style={{
					border: "1px solid #ccc",
					height: "300px",
					overflowY: "scroll",
					marginBottom: "1rem",
				}}
			>
				{messages.map((msg, index) => (
					<p key={index}>
						[{msg.timestamp}]: {msg.text} (Sentiment:{" "}
						{msg.sentiment})
					</p>
				))}
			</div>
			<input
				type="text"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Type a message..."
			/>
			<button onClick={sendMessage}>Send: {input}</button>
		</div>
	);
}

export default Chat;
