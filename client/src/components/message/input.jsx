import React, { useState } from "react";
import "./input.module.css";

function MessageInput() {
	const [message, setMessage] = useState("");

	const handleSend = () => {
		if (message.trim()) {
			console.log("Message Sent:", message);
			setMessage("");
		}
	};

	return (
		<div className="message-input-container">
			<input
				type="text"
				className="message-input"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				placeholder="iMessage"
			/>
			<SendButton onClick={handleSend} />
		</div>
	);
}

function SendButton({ onClick }) {
	return (
		<button onClick={onClick} className="send-button">
			Send
		</button>
	);
}

export default MessageInput;
