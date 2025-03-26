const http = require("http");
const { server: WebSocketServer } = require("websocket");
const Sentiment = require("sentiment");

const sentiment = new Sentiment();

// Create a simple HTTP server (required by the websocket library)
const httpServer = http.createServer((req, res) => {
	res.writeHead(404);
	res.end();
});

httpServer.listen(3001, () => {
	console.log("HTTP server listening on port 3001");
});

// Create the WebSocket server
const wsServer = new WebSocketServer({
	httpServer: httpServer,
	autoAcceptConnections: false,
});

const clients = [];

// Optionally implement origin checking
function originIsAllowed(origin) {
	// Implement logic here if needed.
	return true;
}

wsServer.on("request", (request) => {
	if (!originIsAllowed(request.origin)) {
		request.reject();
		console.log("Connection from origin " + request.origin + " rejected.");
		return;
	}

	const connection = request.accept(null, request.origin);
	const clientIP = connection.remoteAddress;
	console.log(
		`Client connected from ${clientIP}. Total clients before adding: ${clients.length}`
	);

	clients.push(connection);
	console.log(`Client added. Total clients now: ${clients.length}`);

	connection.on("message", (message) => {
		if (message.type === "utf8") {
			try {
				const text = message.utf8Data;
				console.log(`Received message from ${clientIP}: "${text}"`);

				const result = sentiment.analyze(text);
				const payload = JSON.stringify({
					text,
					sentiment: result.score,
					timestamp: new Date().toISOString(),
				});
				console.log(
					`Broadcasting message with sentiment score ${result.score}`
				);

				// Broadcast payload to all connected clients
				clients.forEach((client) => {
					if (client.connected) {
						client.sendUTF(payload);
					}
				});
			} catch (error) {
				console.error("Error processing message:", error);
			}
		}
	});

	connection.on("close", (reasonCode, description) => {
		const index = clients.indexOf(connection);
		if (index !== -1) {
			clients.splice(index, 1);
			console.log(
				`Client from ${clientIP} disconnected. Total clients now: ${clients.length}`
			);
		}
	});

	connection.on("error", (error) => {
		console.error(`WebSocket error with client ${clientIP}:`, error);
	});
});

wsServer.on("close", () => {
	console.log("WebSocket server closed.");
});

console.log("WebSocket server starting using 'websocket' package...");
