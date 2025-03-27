const http = require("http");
const { server: WebSocketServer } = require("websocket");
const { handleConnection } = require("./modules/connectionHandler");

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

wsServer.on("request", (request) => {
	handleConnection(request, wsServer);
});

wsServer.on("close", () => {
	console.log("WebSocket server closed.");
});

console.log("WebSocket Chat server starting...");
