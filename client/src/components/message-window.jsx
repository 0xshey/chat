import React, { useEffect, useRef } from "react";
import Message from "./message";

export default function MessageWindow({ messages, username }) {
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	return (
		<div className={"message-window"}>
			<div className={"messages-container"}>
				{messages.map((msg, index) => (
					<Message
						key={index}
						text={msg.text}
						sender={msg.username}
						isCurrentUser={msg.username === username}
					/>
				))}
				<div ref={messagesEndRef} />
			</div>
		</div>
	);
}
