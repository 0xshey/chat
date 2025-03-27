const { clients } = require("./userManager");

const messageHistory = [];

function storeMessage(data) {
	console.log("Received message:", data);

	// Check if data has all necessary fields
	if (!data.text || !data.timestamp || !data.username) {
		console.error("Invalid message data:", data);
		return;
	}

	// Limit message history to 100 messages
	if (messageHistory.length >= 100) {
		messageHistory.shift();
	}
	messageHistory.push(data);

	console.log("Message stored. Total messages:", messageHistory.length);
}

function sendHistoryToClient(connection) {
	console.warn("SENDING HISTORY TO CLIENT");
	connection.sendUTF(
		JSON.stringify({ type: "chatHistory", history: messageHistory })
	);
}

function broadcastMessage(message) {
	console.warn("BROADCASTING MESSAGE");
	const payload = JSON.stringify(message);

	clients.forEach((client) => {
		if (client.connected) {
			client.sendUTF(payload);
		}
	});
}

module.exports = {
	storeMessage,
	sendHistoryToClient,
	broadcastMessage,
};
