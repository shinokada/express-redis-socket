# Simple socket.it

- connecting with socket.io
- listening with on
- sending with emit

The `io.on()` method sets up an event listener for the 'connection' event, which is emitted when a new client connects to the server. When a new connection is established, a socket object is passed to the callback function, which represents the communication channel between the client and server.

Inside the callback function, there is another event listener for the 'socketping' event, which is emitted by the client. When this event is received, the server logs a message to the console and emits a 'socketpong' event back to the client.

The `<script src="/socket.io/socket.io.js"></script>` element includes the socket.io client library in your HTML file, which allows you to use the io() function in your JavaScript code to create a new socket.io client.

The io() function is provided by the socket.io client library, which establishes a real-time, bidirectional communication channel between the client and server. The client library handles the details of the WebSocket protocol, including creating and managing the WebSocket connection, as well as emitting and listening for events.

Without this <script> element, you would not be able to use the `io()` function in the JavaScript code, and you would not be able to establish a real-time, bidirectional communication channel between the client and server using socket.io.

