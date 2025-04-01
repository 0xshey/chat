import React from "react";

function Message({ text, sender, isCurrentUser }) {
	return (
		<div
			className={`message ${
				isCurrentUser ? "current-user" : "other-user"
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
			className={`message-bubble ${
				isCurrentUser ? "current-user-bubble" : "other-user-bubble"
			}`}
		>
			{text}
		</div>
	);
}

function MessageSenderAvatar({ sender }) {
	return <div className="avatar">{sender.charAt(0).toUpperCase()}</div>;
}

function MessageSenderName({ name }) {
	return <div className="sender-name">{name}</div>;
}

export default Message;
