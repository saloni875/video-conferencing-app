import { Server, Socket } from "socket.io";


let connection = {}
let messages = {}
let timeOnline = {}


const connectToSocket = (server) => {
    const io = new Server(server);
    io.on("connection", (Socket) => {

        Socket.on("join-call", (path) => {
            if (connection[path] === undefined) {
                connection[path] = [];
            }
            connection[path].push = [Socket.id]

            timeOnline[Socket.id] = new Date();

            for (let a = 0; a < connection[path].length; i++) {
                io.to(connection[path][a]).emit("user-joined", Socket.id, connection[path])
            }
            if (messages[path] === undefined) {
                for (let a = 0; a < messages[path].length; ++a) {
                    io.to(Socket.id).emit("chat-message", messages[path][a]['date'],
                        messages[path][a]["sender"], messages[path][a]['socket-id-sender']
                    )
                }
            }
        })

        Socket.on("signal", (to_ID, messages) => {
            io.to(to_ID).emit("signal", Socket.id, messages);
        })
        Socket.on("chat-message", (data, sender) => {

            const [matchingRoom, found] = Object.entries(connection)
                .reduce(([room, isFound], [roomkey, roomValue]) => {
                    if (!isFound && roomValue.includes(Socket.id)) {
                        return [roomkey, true];
                    }
                    return [room, isFound]
                }, ['', false]);

            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = []
                }
                messages[matchingRoom].push({ 'sender': sender, 'data': data, 'socket-id-sender': Socket.id })
                console.log("message", key, ":", sender, data)

                connection[matchingRoom].foreach((el) => {
                    io.to(el).emit("chat-message", data, sender, Socket.id)
                })
            }
        })
    })
    Socket.on("disconnect", () => {
        var diffTime = Math.abs(timeOnline[Socket.id] - new Date())

        var key 

        for(const [k, v] of JSON.parse(JSON.stringify(Object.entries(connection)))){

            for(let a= 0; a<v.length; ++a){
                if(v[a] === Socket.id){
                    key = k
                    for(let a= 0; a<connection[key].length; ++a){
                        io.to(connection[key][a]).emit('user-left', Socket.id)
                    }
                    var index= connection[key].indexOf(Socket.id)

                    connection[key].splice(index, 1)


                    if(connection[key].length === 0){
                        delete connection[key]
                    }
                }
            }
        }
    })


    return io;
}

export default connectToSocket;