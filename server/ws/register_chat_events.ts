import { Server } from "socket.io"

export default function(wsServer: Server) {
	const messages: string[] = []

	wsServer.on("connection", (socket) => {
		const connectionInfo = {
			roomID: "",
			userID: "",
			userName: ""
		}

		socket.on("set_user_id", userID => {
			connectionInfo.userID = userID;
		})

		socket.on("join_room", (roomID, userName) => {
			connectionInfo.roomID = roomID
			connectionInfo.userName = userName
			socket.join(connectionInfo.roomID)
			console.log(`User ${connectionInfo.userName} joined in ${connectionInfo.roomID}`)

			socket.to(connectionInfo.roomID)
				.emit("connect_user", connectionInfo.userName, connectionInfo.userID)
			socket.on("disconnect", () => {
				console.log(`User ${connectionInfo.userName} leaved`)
				socket.to(connectionInfo.roomID).emit("disconnect_user", connectionInfo.userName)
			})
		})

		socket.on("call_on_room", function(email) {
			console.log(email, "initiated call")
		})

		socket.on("get_last_messages", function (fn) {
			fn(messages.slice(-50))
		})

		socket.on("send_message", function (message) {
			messages.push(message)
			wsServer.sockets.in(connectionInfo.roomID).emit("receive_message", message)
		})
	})
}
