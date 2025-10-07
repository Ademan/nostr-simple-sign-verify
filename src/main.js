import { decode, npubEncode } from 'nostr-tools/nip19';
import { verifyEvent } from 'nostr-tools/pure'

(async () => {
	const messageElement = document.getElementById("message");

	const classes = new Set(["error", "success", "warning"]);

	function displayMessage(message, klass) {
		let removeClasses = new Set(classes);
		removeClasses.delete(klass);
		removeClasses = Array.from(removeClasses);

		messageElement.classList.remove(...removeClasses);
		messageElement.classList.add(klass);
		messageElement.textContent = message;
		messageElement.classList.remove("hidden");
	}

	function displayError(message) {
		displayMessage(message, "error");
	}

	function displaySuccess(message) {
		displayMessage(message, "success");
	}

	function displayWarning(message) {
		displayMessage(message, "success");
	}

	function hideMessage() {
		messageElement.classList.add("hidden");
		messageElement.classList.remove("error", "success", "warning");
		messageElement.textContent = "";
	}

	const npubInput = document.getElementById("npub");
	const eventInput = document.getElementById("event");
	const signButton = document.getElementById("sign-button");
	const verifyButton = document.getElementById("verify-button");

	async function sign() {
		if (typeof window.nostr === "undefined") {
			displayError("NIP-07 Extension not detected");
			return;
		}

		try {
			let nostrEvent = JSON.parse(eventInput.value);

			let signedEvent = await window.nostr.signEvent(nostrEvent);

			eventInput.value = JSON.stringify(signedEvent);
			console.log("npubEncode")
			npubInput.value = npubEncode(signedEvent.pubkey);

			displaySuccess("Signed event");
			console.log("Signing success")
		} catch (e) {
			displayError("Failed to parse event");
			console.log(`Failed to parse event, error: "${e}"`);
		}
	}

	function verify() {
		try {
			let nostrEvent = JSON.parse(eventInput.value);
			let npub = null;

			try {
				npub = decode(npubInput.value);
			} catch (e) {
			}
			
			if (npub !== null && npub.data != nostrEvent.pubkey) {
				displayError("npub did not match event");
				return;
			}

			if (verifyEvent(nostrEvent)) {
				if (npub != null) {
					displaySuccess("Event Validated!");
				} else {
					displayWarning("Event validated, but no npub checked");
				}
			} else {
				displayError("Event failed validation");
				console.log("Event failed validation");
			}
		} catch (e) {
			displayError("Failed to parse event");
			console.log(`Failed to parse event, error: "${e}"`);
		}
	}

	signButton.addEventListener("click", sign);
	verifyButton.addEventListener("click", verify);
})();
