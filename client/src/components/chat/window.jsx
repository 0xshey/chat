import React from "react";

import styles from "./window.module.css";
import Message from "../message/message";

export default function ChatWindow({ messages }) {
	return (
		<div className={styles["chat-window"]}>
			<div className={styles["messages-container"]}>
				{messages.map((msg, index) => (
					<Message
						key={index}
						text={msg.text}
						sender={msg.username}
						isCurrentUser={false}
					/>
				))}
			</div>
		</div>
	);
}
