<script>
    const concertDetails = {
        id: 4,
        name: "Taylor Swift: The Eras Tour",
        date: "September 15, 2024",
        time: "7:30 PM",
        venue: "Rogers Centre",
        city: "Toronto, ON",
        price: 150.0,
        description:
            "Experience the magic of Taylor Swift's record-breaking Eras Tour, celebrating her incredible musical journey across multiple albums.",
    };

    function validateForm() {
        const form = document.getElementById("ticketForm");
        if (!form) return false;

        const errors = {};

        // Email validation
        const emailInput = form.querySelector('input[name="email"]');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput && !emailRegex.test(emailInput.value)) {
            errors.email = "Please enter a valid email address";
        }

        // Phone validation
        const phoneInput = form.querySelector('input[name="phone"]');
        const phoneRegex =
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (phoneInput && !phoneRegex.test(phoneInput.value)) {
            errors.phone = "Please enter a valid phone number";
        }

        // Credit card validation
        const creditCardInput = form.querySelector('input[name="creditCard"]');
        const creditCardRegex = /^\d{16}$/;
        if (
            creditCardInput &&
            !creditCardRegex.test(creditCardInput.value.replace(/\s/g, ""))
        ) {
            errors.creditCard = "Credit card must be 16 digits";
        }

        // Expiration date validation
        const expirationInput = form.querySelector('input[name="expiration"]');
        const expirationRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (expirationInput) {
            if (!expirationRegex.test(expirationInput.value)) {
                errors.expiration = "Expiration must be in MM/YY format";
            } else {
                const [month, year] = expirationInput.value.split("/");
                const expirationDate = new Date(
                    2000 + parseInt(year, 10),
                    parseInt(month, 10) - 1,
                );
                const currentDate = new Date();

                if (expirationDate <= currentDate) {
                    errors.expiration = "Credit card has expired";
                }
            }
        }

        // Security code validation
        const securityCodeInput = form.querySelector(
            'input[name="securityCode"]',
        );
        const securityCodeRegex = /^\d{3,4}$/;
        if (
            securityCodeInput &&
            !securityCodeRegex.test(securityCodeInput.value)
        ) {
            errors.securityCode = "Security code must be 3-4 digits";
        }

        // Postal code validation
        const postalCodeInput = form.querySelector('input[name="postalCode"]');
        const postalCodeRegex = /^[a-zA-Z0-9]{6}$/;
        if (
            postalCodeInput &&
            !postalCodeRegex.test(postalCodeInput.value.replace(/\s/g, ""))
        ) {
            errors.postalCode = "Postal code must be 6 alphanumeric characters";
        }

        // Display all validation errors
        Object.keys(errors).forEach((field) => {
            const errorElement = document.getElementById(`${field}-error`);
            if (errorElement) {
                errorElement.textContent = errors[field];
            }
        });

        return Object.keys(errors).length === 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        // Clear all previous error messages
        document.querySelectorAll(".error-message").forEach((el) => {
            if (el instanceof HTMLElement) {
                el.textContent = "";
            }
        });

        // Don't proceed if the form doesn't validate
        if (!validateForm()) {
            return;
        }

        try {
            // Extract form data into a JS object
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());

            // Convert string values to integers for numeric fields
            data.concertId = parseInt(data.concertId.toString(), 10);
            data.quantity = parseInt(data.quantity.toString(), 10);

            // Remove all spaces from credit card number
            if (typeof data.creditCard === "string") {
                data.creditCard = data.creditCard.replace(/\s/g, "");
            }

            // Remove spaces from postal code
            if (typeof data.postalCode === "string") {
                data.postalCode = data.postalCode.replace(/\s/g, "");
            }

            // Send the API request
            const response = await fetch("/api/tickets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert("Ticket purchase successful!");
                event.target.reset();
            } else {
                // Handle error responses
                try {
                    const errorData = await response.json();
                    alert(
                        `Purchase failed: ${errorData.error || errorData.details || errorData.message || "Unknown error"}`,
                    );
                } catch (jsonError) {
                    alert("Purchase failed: Unable to process server response");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            // Fallback for development
            if (
                confirm(
                    "Network error occurred. Would you like to simulate a successful purchase for development purposes?",
                )
            ) {
                alert("Ticket purchase simulated successfully!");
                event.target.reset();
            } else {
                alert("An error occurred during ticket purchase");
            }
        }
    }

    function formatCreditCard(event) {
        const target = event.target;
        let value = target.value.replace(/\D/g, ""); // Strip all non-digit characters
        if (value.length > 16) {
            value = value.substring(0, 16);
        }
        // Add spaces between groups of 4 digits
        let formattedValue = "";
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += " ";
            }
            formattedValue += value[i];
        }
        target.value = formattedValue;
    }

    function formatPostalCode(event) {
        const target = event.target;
        let value = target.value.replace(/\s/g, "");
        if (value.length > 6) {
            value = value.substring(0, 6);
        }
        target.value = value;
    }
</script>

<svelte:head>
    <title>Concert Ticket Purchase - {concertDetails.name}</title>
</svelte:head>

<div class="banner"></div>
<div class="concert-container">
    <div class="concert-info">
        <h1>{concertDetails.name}</h1>
        <p><strong>Date:</strong> {concertDetails.date}</p>
        <p><strong>Time:</strong> {concertDetails.time}</p>
        <p><strong>Venue:</strong> {concertDetails.venue}</p>
        <p><strong>City:</strong> {concertDetails.city}</p>
        <p><strong>Ticket Price:</strong> ${concertDetails.price.toFixed(2)}</p>
        <p>{concertDetails.description}</p>
    </div>

    <form id="ticketForm" class="ticket-form" on:submit={handleSubmit}>
        <input type="hidden" name="concertId" value={concertDetails.id} />

        <label for="email">Email</label>
        <input
            id="email"
            type="email"
            name="email"
            required
            placeholder="your.email@example.com"
        />
        <div id="email-error" class="error-message"></div>

        <label for="name">Full Name</label>
        <input
            id="name"
            type="text"
            name="name"
            required
            placeholder="John Doe"
        />
        <div id="name-error" class="error-message"></div>

        <label for="phone">Phone Number</label>
        <input
            id="phone"
            type="tel"
            name="phone"
            required
            placeholder="+1-123-456-7890"
        />
        <div id="phone-error" class="error-message"></div>

        <label for="quantity">Number of Tickets</label>
        <select id="quantity" name="quantity" required>
            {#each Array(10) as _, i}
                <option value={i + 1}>{i + 1}</option>
            {/each}
        </select>

        <label for="creditCard">Credit Card Number</label>
        <input
            id="creditCard"
            type="text"
            name="creditCard"
            required
            placeholder="1234 5678 9012 3456"
            on:input={formatCreditCard}
        />
        <div id="creditCard-error" class="error-message"></div>

        <label for="expiration">Expiration Date</label>
        <input
            id="expiration"
            type="text"
            name="expiration"
            required
            placeholder="MM/YY"
        />
        <div id="expiration-error" class="error-message"></div>

        <label for="securityCode">Security Code</label>
        <input
            id="securityCode"
            type="text"
            name="securityCode"
            required
            placeholder="123"
        />
        <div id="securityCode-error" class="error-message"></div>

        <label for="address">Address</label>
        <input
            id="address"
            type="text"
            name="address"
            required
            placeholder="123 Concert Street"
        />
        <div id="address-error" class="error-message"></div>

        <label for="city">City</label>
        <input
            id="city"
            type="text"
            name="city"
            required
            placeholder="Toronto"
        />
        <div id="city-error" class="error-message"></div>

        <label for="province">Province</label>
        <input
            id="province"
            type="text"
            name="province"
            required
            placeholder="ON"
        />
        <div id="province-error" class="error-message"></div>

        <label for="postalCode">Postal Code</label>
        <input
            id="postalCode"
            type="text"
            name="postalCode"
            required
            placeholder="A1B2C3"
            maxlength="6"
            on:input={formatPostalCode}
        />
        <div id="postalCode-error" class="error-message"></div>

        <label for="country">Country</label>
        <input
            id="country"
            type="text"
            name="country"
            required
            placeholder="Canada"
        />
        <div id="country-error" class="error-message"></div>

        <button type="submit">Purchase Tickets</button>
    </form>
</div>

<style>
    :global(body) {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        background-color: #121212;
        color: #e0e0e0;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        width: 100%;
        overflow-x: hidden;
    }

    .banner {
        background-image: url("/banner.jpg");
        background-size: cover;
        background-position: center;
        height: 400px;
        width: 100%;
    }

    .concert-container {
        display: flex;
        background-color: #1e1e1e;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        overflow: hidden;
        width: 100%;
    }

    .concert-info {
        width: 50%;
        padding: 30px;
        background-color: #242424;
        word-wrap: break-word;
    }

    .ticket-form {
        width: 50%;
        padding: 30px;
    }

    input,
    select {
        width: 100%;
        padding: 10px;
        margin-bottom: 5px;
        border: 1px solid #444;
        border-radius: 5px;
        background-color: #2a2a2a;
        color: #e0e0e0;
    }

    input::placeholder {
        color: #999;
    }

    .error-message {
        color: #ff6b6b;
        font-size: 0.8em;
        margin-bottom: 10px;
    }

    button {
        width: auto;
        min-width: 180px;
        max-width: 250px;
        padding: 10px 15px;
        margin: 15px auto 0;
        display: block;
        background-color: #c62828;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        transition: all 0.3s ease;
    }

    button:hover {
        background-color: #e53935;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    button:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    h1 {
        color: #ffffff;
    }

    input:focus,
    select:focus {
        border-color: #c62828;
        outline: none;
    }

    @media screen and (max-width: 767px) {
        .banner {
            width: 95%;
        }

        .concert-container {
            display: flex;
            flex-direction: column;
        }

        .concert-info,
        .ticket-form {
            width: 80%;
            max-width: 100%;
        }

        button {
            width: 50%;
            max-width: 100%;
        }
    }
</style>
