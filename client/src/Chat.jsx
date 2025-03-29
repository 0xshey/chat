import { useState, useEffect, useRef } from "react";

import ChatWindow from "./components/chat/window";

function Chat() {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [username, setUsername] = useState("");
	const [usernameInput, setUsernameInput] = useState("");
	const [users, setUsers] = useState([]);
	const [connected, setConnected] = useState(false);
	const [paused, setPaused] = useState(false);
	const socketRef = useRef(null);

	console.log("Chat rendered");

	useEffect(() => {
		socketRef.current = new WebSocket("ws://localhost:3001");

		socketRef.current.onopen = () => {
			console.log("WebSocket connection established.");
			setConnected(true);

			if (username) {
				socketRef.current.send(
					JSON.stringify({ type: "setUsername", username })
				);
			}
		};

		socketRef.current.onclose = () => {
			console.log("WebSocket connection closed.");
			setConnected(false);
		};

		return () => {
			if (socketRef.current.readyState === WebSocket.OPEN) {
				socketRef.current.close();
			}
		};
	}, [username]);

	useEffect(() => {
		if (!socketRef.current) return;

		socketRef.current.onmessage = (event) => {
			const receivedMessage = JSON.parse(event.data);

			if (receivedMessage.type === "userList") {
				setUsers(receivedMessage.users);
			} else if (receivedMessage.type === "chatHistory") {
				setMessages(receivedMessage.history);
			} else {
				setMessages((prevMessages) => [
					...prevMessages,
					receivedMessage,
				]);
			}

			// setMessages([...messages, receivedMessage]);
			console.log(receivedMessage);
		};
	}, [paused]);

	function sendMessage() {
		if (input.trim() !== "") {
			const message = {
				type: "message",
				text: input,
				timestamp: new Date().toISOString(),
			};
			socketRef.current.send(JSON.stringify(message));
			setInput("");
		}
	}

	function handleUsernameSubmit() {
		if (usernameInput.trim() !== "") {
			setUsername(usernameInput);
			socketRef.current.send(
				JSON.stringify({ type: "setUsername", username })
			);
		}
	}

	return (
		<div>
			{!username ? (
				<div>
					<h2>Set Username</h2>
					<input
						type="text"
						value={usernameInput}
						onChange={(e) => setUsernameInput(e.target.value)}
						placeholder="Choose a username"
					/>
					<button onClick={handleUsernameSubmit}>Submit</button>
				</div>
			) : (
				<>
					<h2>
						Chatting as <em>{username}</em>
					</h2>
					<div>
						<h3>Users online</h3>
						<ul>
							{users.map((user, index) => (
								<li key={index}>{user}</li>
							))}
						</ul>
					</div>
					<p>{messages.length} messages</p>

					{/* Chat Window */}
					<ChatWindow messages={messages} />

					<div
						style={{
							border: "1px solid #ccc",
							height: "300px",
							overflowY: "scroll",
							marginBottom: "1rem",
							margin: "20px",
						}}
					>
						{messages.map((msg, index) => (
							<p key={index}>
								<strong>{msg.username}</strong> {msg.text}
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
				</>
			)}
		</div>
	);
}

export default Chat;
