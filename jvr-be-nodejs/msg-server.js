require("dotenv").config();

const express = require("express");
const app = express();
const { Resend } = require("resend");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const validator = require("validator");
const { buildHtmlMessage } = require("./middleware/html-message-builder");
const { santizeForm } = require("./middleware/sanitize-form");
const { validateContactForm } = require("./middleware/validate-form");

const port = process.env.PORT || 3000;

if (!process.env.RESEND_API_KEY) {
	throw new Error("Missing env var: RESEND_API_KEY");
}
if (!process.env.RESEND_EMAIL) {
	throw new Error("Missing env var: RESEND_EMAIL");
}
if (!process.env.RESEND_NAME) {
	throw new Error("Missing env var: RESEND_NAME");
}
if (!process.env.FORWARDING_EMAIL) {
	throw new Error("Missing env var: FORWARDING_EMAIL");
}

const forwardingEmail = process.env.FORWARDING_EMAIL;
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(
	cors({
		origin: process.env.JVR_DOMAIN_ADDRESS || "*",
	}),
);

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.post(
	"/message",
	rateLimit({
		windowMs: 60_000,
		max: 3,
		standardHeaders: true,
		legacyHeaders: false,
	}),
	async (req, res) => {

		const { contactForm } = req.body;

		validateContactForm(req, res, () => {});

		const safeContactForm = santizeForm(contactForm);
		const cleanHTML = buildHtmlMessage(safeContactForm);

		try {
			const { data, error } = await resend.emails.send({
				from: `${process.env.RESEND_NAME} <${process.env.RESEND_EMAIL}>`, //TODO: Add private domain support later and use JVR domain for this email
				replyTo: `${safeContactForm.firstName} ${safeContactForm.lastName} <${safeContactForm.email}>`,
				to: [forwardingEmail],
				subject: safeContactForm.subject,
				text: `You have received a new message from ${safeContactForm.firstName} ${safeContactForm.lastName} (${safeContactForm.email}):\n\n${safeContactForm.message}`,
				html: cleanHTML,
			});

			if (error) {
				console.error("Resend API error:", error);
				return res.status(500).send("Failed to send email");
			} else {
				res.status(200).send("Email sent successfully");
			}
		} catch (err) {
			console.error("Unexpected error:", err);
			res.status(500).send("An unexpected error occurred");
		}
	},
);

app.listen(port, () => console.log(`Listening on port ${port}`));
