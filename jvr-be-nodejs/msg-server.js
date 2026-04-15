require("dotenv").config();

const express = require("express");
const app = express();
const { Resend } = require("resend");
const cors = require("cors");
const { JSDOM } = require("jsdom");
const createDOMPurify = require("dompurify");
const { window } = new JSDOM("");
const DOMPurify = createDOMPurify(window);
const rateLimit = require("express-rate-limit");
const validator = require("validator");

const port = process.env.PORT || 3000;
const forwardingEmail = process.env.FORWARDING_EMAIL || "";
const resend = new Resend(process.env.RESEND_API_KEY) || null;

app.use(
	cors({
		origin: process.env.JVR_DOMAIN_ADDRESS || "*",
	}),
);

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.post(
	"/message",
	rateLimit({ windowMs: 60_000, max: 3 }),
	async (req, res) => {
		let cleanHTML;
		const { contactForm } = req.body;

		if (!forwardingEmail) {
			return res.status(500).send("Forwarding email is not configured");
		}

		if (!req.is("application/json")) {
			return res.status(400).send("Expected application/json");
		}

		if (
			!contactForm ||
			!contactForm.name ||
			!contactForm.email ||
			!contactForm.subject ||
			!contactForm.message
		) {
			return res
				.status(400)
				.send("Missing required fields: name, email, subject, message");
		}

		if (!validator.isEmail(contactForm.email)) {
			return res.status(400).send("Invalid email address");
		}

		cleanHTML = DOMPurify.sanitize(
			`<strong>${contactForm.name} <${contactForm.email}></strong><br><br><p>${contactForm.message}</p>`,
		);

		try {
			const { data, error } = await resend.emails.send({
				from: `${process.env.RESEND_NAME} <${process.env.RESEND_EMAIL}>`,
				replyTo: `${contactForm.name} <${contactForm.email}>`,
				to: [forwardingEmail],
				subject: contactForm.subject,
				text: `You have received a new message from ${contactForm.name} (${contactForm.email}):\n\n${contactForm.message}`,
				html: cleanHTML,
			});

			if (error) {
				res.status(500).send("Failed to send email");
			} else {
				res.status(200).send("Email sent successfully");
			}
		} catch (err) {
			res.status(500).send("An unexpected error occurred");
		}
	},
);

app.listen(port);
