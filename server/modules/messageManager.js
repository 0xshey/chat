const { clients } = require("./userManager");

const messageHistory = [];

function storeMessage(data) {
	if (messageHistory.length >= 100) {
		messageHistory.shift();
	}
	messageHistory.push(data);
}

function sendHistoryToClient(connection) {
	connection.sendUTF(
		JSON.stringify({ type: "chatHistory", history: messageHistory })
	);
}

function broadcastMessage(message) {
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
