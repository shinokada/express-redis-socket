# Interacting with another browser

- Sending messages to all browsers
- Setting connection method


The `socket` object is a connection from one browser to the server.
The `io` object is a server object that knows all connections.


## static/index.html:

The io function is the main function exported by the socket.io-client library. It creates a new Socket.io client and connects it to the server. In this case, the io function is called with an options object that specifies that the client should only use WebSockets as the transport protocol and should not attempt to upgrade the connection to a different protocol.

The document.getElementById('send').addEventListener('click', (e) => { ... }) code sets up an event listener for the click event on the element with the ID of send. When the element is clicked, the event listener function is called, and it emits a name event to the server with the value of the element with the ID of name as the data.

The socket.on('name', (name) => { ... }) code sets up an event listener for the name event on the socket. When the name event is received from the server, the event listener function is called and it creates a new li element, sets the text of the element to the value of name plus the string " says Hello!", and appends the li element to the element with the ID of list. This has the effect of adding a new list item to the list with the text of the name of the person who said hello.