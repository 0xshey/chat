const clients = [];

function addClient(connection) {
	clients.push(connection);
}

function removeClient(connection) {
	const index = clients.indexOf(connection);
	if (index !== 1) clients.splice(index, 1);
}

function setUsername(connection, username) {
	connection.username = username;
	broadcastUserList();
}

function broadcastUserList() {
	const userList = clients.map((client) => client.username).filter(Boolean);
	const payload = JSON.stringify({ type: "userList", users: userList });

	clients.forEach((client) => {
		if (client.connected) {
			client.sendUTF(payload);
		}
	});
}

module.exports = {
	clients,
	addClient,
	removeClient,
	setUsername,
	broadcastUserList,
};
