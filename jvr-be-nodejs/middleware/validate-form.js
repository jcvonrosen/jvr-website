const validator = require("validator");

const MAX_LENGTHS = {
	name: 100,
	subject: 200,
	message: 5000,
};

function validateContactForm(req, res, next) {
	if (!req.is("application/json")) {
		return res.status(400).send("Expected application/json");
	}

	const contactForm = req.body;

	if (
		!contactForm ||
		!contactForm.firstName ||
		!contactForm.lastName ||
		!contactForm.email ||
		!contactForm.phone ||
		!contactForm.subject ||
		!contactForm.message
	) {
		return res
			.status(400)
			.send(
				"Missing required fields: firstName, lastName, email, phone, subject, message",
			);
	}

	if (!validator.isEmail(contactForm.email)) {
		return res.status(400).send("Invalid email address");
	}

	if (
		contactForm.firstName.length > MAX_LENGTHS.name ||
		contactForm.lastName.length > MAX_LENGTHS.name ||
		contactForm.subject.length > MAX_LENGTHS.subject ||
		contactForm.message.length > MAX_LENGTHS.message
	) {
		return res.status(400).send("One or more fields exceed maximum length");
	}

	next();
}

module.exports = { validateContactForm };
