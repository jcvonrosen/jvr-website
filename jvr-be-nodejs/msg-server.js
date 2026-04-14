const express = require("express");
const app = express();
const port = 3000;
app.get("/", (req, res) => {
	res.send("Hello World!");
});
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

app.post("/message", (req, res) => {
	console.log("Received message:", req.body);
	res.send("Message received");
});

app.options("/message", (req, res) => {
	res.set("Allow", "POST, OPTIONS");
	res.sendStatus(204);
});

var message = "hello world";
console.log(message);
