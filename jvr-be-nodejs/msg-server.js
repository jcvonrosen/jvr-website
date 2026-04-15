require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const contactMessageRouter = require("./routes/contact-message");

const port = process.env.PORT || 3000;

app.use(
	cors({
		origin: process.env.JVR_DOMAIN_ADDRESS || "*",
	}),
);

app.use(express.json({ limit: "10kb" }));

app.get("/api/", (req, res) => {
	res.send("Hello World!");
});

app.use("/api/", contactMessageRouter);
app.listen(port, () => console.log(`Listening on port ${port}`));
