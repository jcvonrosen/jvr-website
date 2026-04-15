require("dotenv").config();
import { Resend } from "resend";

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const forwardingEmail = process.env.FORWARDING_EMAIL;
const resend = new Resend("re_xxxxxxxxx");

app.use(cors());
app.get("/", (req, res) => {
	res.send("Hello World!");
});
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

app.post("/message", (req, res) => {
	if (!req.is("application/json")) {
		return res.status(400).send("Expected application/json");
	}

	console.log("Received message:", req.body);
	const { contactForm } = req.body;

	(async () => {
		const { data, error } = await resend.emails.send({
			from: `${contactForm.name} <${contactForm.email}>`,
			to: [forwardingEmail],
			subject: contactForm.subject,
			text: `You have received a new message from ${contactForm.name} (${contactForm.email}):\n\n${contactForm.message}`,
			html: "<strong>It works!</strong>",
		});

		if (error) {
			return console.error({ error });
		}

		console.log({ data });
	})();

	res.send("Message received");
});

app.options("/message", (req, res) => {
	res.set("Allow", "POST, OPTIONS");
	res.sendStatus(204);
});
