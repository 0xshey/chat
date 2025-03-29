import React from "react";
import styles from "./message.module.css";

function Message({ text, sender, isCurrentUser }) {
	return (
		<div
			className={`${styles.message} ${
				isCurrentUser ? styles["current-user"] : styles["other-user"]
			}`}
		>
			{!isCurrentUser && <MessageSenderAvatar sender={sender} />}
			<div>
				{!isCurrentUser && <MessageSenderName name={sender} />}
				<MessageBubble text={text} isCurrentUser={isCurrentUser} />
			</div>
		</div>
	);
}

function MessageBubble({ text, isCurrentUser }) {
	return (
		<div
			className={`${styles["message-bubble"]} ${
				isCurrentUser
					? styles["current-user-bubble"]
					: styles["other-user-bubble"]
			}`}
		>
			{text}
		</div>
	);
}

function MessageSenderAvatar({ sender }) {
	return (
		<div className={styles.avatar}>{sender.charAt(0).toUpperCase()}</div>
	);
}

function MessageSenderName({ name }) {
	return <div className={styles["sender-name"]}>{name}</div>;
}

export default Message;
