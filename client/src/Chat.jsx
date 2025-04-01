import { useState, useEffect, useRef } from "react";

import MessageWindow from "./components/message-window";

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
				<div className="chat-header">
					<h2 className="chatting-as">
						Chatting as <em className="username">{username}</em>
					</h2>
					<p className="message-count">{messages.length} messages</p>
				</div>
			)}

			{username && (
				<>
					<div className="main-window">
						<div className="sidebar">
							{/* Online Users */}
							<ul className="active-list">
								<h3>Online Now</h3>
								{users.map((user, index) => (
									<li className="active-user" key={index}>
										{user}
									</li>
								))}
							</ul>
						</div>

						<div className="chat-window">
							<div>
								{/* Chat Window */}
								<MessageWindow
									messages={messages}
									username={username}
								/>
								{/*  Input */}
								<div className={"message-input-container"}>
									<input
										type="text"
										className={"message-input"}
										value={input}
										onChange={(e) =>
											setInput(e.target.value)
										}
										placeholder="iMessage"
									/>
									<button
										onClick={sendMessage}
										className="send-button"
									>
										Send
									</button>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default Chat;
