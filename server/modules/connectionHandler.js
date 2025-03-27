const {
	addClient,
	removeClient,
	setUsername,
	broadcastUserList,
} = require("./userManager");
const {
	storeMessage,
	sendHistoryToClient,
	broadcastMessage,
} = require("./messageManager");

const Sentiment = require("sentiment");
const sentiment = new Sentiment();

function handleConnection(request, wsServer) {
	const connection = request.accept(null, request.origin);
	console.log(`Client connected from ${connection.remoteAddress}`);

	addClient(connection);
	sendHistoryToClient(connection);

	connection.on("message", (message) => {
		if (message.type === "utf8") {
			const data = JSON.parse(message.utf8Data);

			if (data.type === "setUsername") {
				setUsername(connection, data.username);
			} else if (data.type === "message") {
				const sentimentResult = sentiment.analyze(data.text);
				const messageData = {
					username: connection.username || "anon",
					text: data.text,
					sentiment: sentimentResult.score,
					timestamp: new Date().toISOString(),
				};

				storeMessage(messageData);
				broadcastMessage(messageData);
			}
		}
	});

	connection.on("close", () => {
		removeClient(connection);
		console.log(`Client disconnected: ${connection.remoteAddress}`);
		broadcastUserList();
	});

	connection.on("error", (error) => {
		console.error("WebSocket error:", error);
	});
}

module.exports = { handleConnection };
