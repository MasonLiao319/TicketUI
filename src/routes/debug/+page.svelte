<script>
    // API endpoint variables
    const API_URL = "/api/tickets";
    const EXTERNAL_API =
        "https://nscc-0424837-ticketapi-augpgqecg5eebkcu.canadacentral-01.azurewebsites.net/api/tickets";

    let internalApiStatus = "Not tested";
    let externalApiStatus = "Not tested";
    let responseDetails = "";
    let loading = false;

    // Test internal API connection
    async function testInternalApi() {
        internalApiStatus = "Testing...";
        loading = true;
        try {
            const response = await fetch(API_URL, {
                method: "OPTIONS",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            internalApiStatus = response.ok
                ? `✅ Connection successful (Status code: ${response.status})`
                : `❌ Connection failed (Status code: ${response.status})`;

            responseDetails = `Internal API Test - Headers:\n${Array.from(
                response.headers.entries(),
            )
                .map(([key, value]) => `${key}: ${value}`)
                .join("\n")}`;
        } catch (error) {
            internalApiStatus = `❌ Connection error: ${error.message}`;
            responseDetails = `Error details: ${error.stack || "No stack trace provided"}`;
        } finally {
            loading = false;
        }
    }

    // Test external API connection
    async function testExternalApi() {
        externalApiStatus = "Testing...";
        loading = true;
        try {
            const response = await fetch(EXTERNAL_API, {
                method: "OPTIONS",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            externalApiStatus = response.ok
                ? `✅ Connection successful (Status code: ${response.status})`
                : `❌ Connection failed (Status code: ${response.status})`;

            responseDetails = `External API Test - Headers:\n${Array.from(
                response.headers.entries(),
            )
                .map(([key, value]) => `${key}: ${value}`)
                .join("\n")}`;
        } catch (error) {
            externalApiStatus = `❌ Connection error: ${error.message}`;
            responseDetails = `Error details: ${error.stack || "No stack trace provided"}`;
        } finally {
            loading = false;
        }
    }

    // Test a mock ticket purchase request
    async function testPurchase() {
        responseDetails = "Sending test purchase request...";
        loading = true;

        try {
            // Create a test data object
            const testData = {
                concertId: 4,
                email: "test@example.com",
                name: "Test User",
                phone: "123-456-7890",
                quantity: 1,
                creditCard: "4111111111111111",
                expiration: "12/30",
                securityCode: "123",
                address: "123 Test St",
                city: "Test City",
                province: "TC",
                postalCode: "A1B2C3",
                country: "Canada",
            };

            // Send request to internal API
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(testData),
            });

            // Get response
            let responseText;
            try {
                const jsonResponse = await response.json();
                responseText = JSON.stringify(jsonResponse, null, 2);
            } catch (e) {
                responseText = await response.text();
            }

            responseDetails = `Test purchase response (Status code: ${response.status}):\n\n${responseText}`;
        } catch (error) {
            responseDetails = `Test purchase error:\n${error.message}\n\n${error.stack || ""}`;
        } finally {
            loading = false;
        }
    }

    function showEnvironmentInfo() {
        const envInfo = {
            "User Agent": navigator.userAgent,
            Hostname: window.location.hostname,
            URL: window.location.href,
            Protocol: window.location.protocol,
            "Internal API URL": API_URL,
            "External API URL": EXTERNAL_API,
        };

        responseDetails = `Environment Information:\n${Object.entries(envInfo)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n")}`;
    }
</script>

<svelte:head>
    <title>API Connection Debug Tool</title>
</svelte:head>

<div class="debug-container">
    <h1>API Connection Debug Tool</h1>
    <p>Use this page to test your API connections and request handling.</p>

    <div class="test-section">
        <h2>Connection Tests</h2>
        <div class="test-row">
            <div>
                <button on:click={testInternalApi} disabled={loading}>
                    Test Internal API
                </button>
                <span class="status">{internalApiStatus}</span>
            </div>
            <div>
                <button on:click={testExternalApi} disabled={loading}>
                    Test External API
                </button>
                <span class="status">{externalApiStatus}</span>
            </div>
        </div>
    </div>

    <div class="test-section">
        <h2>Functionality Tests</h2>
        <div class="test-row">
            <button on:click={testPurchase} disabled={loading}>
                Simulate Purchase Request
            </button>
            <button on:click={showEnvironmentInfo} disabled={loading}>
                Show Environment Info
            </button>
        </div>
    </div>

    <div class="response-section">
        <h2>Response Details</h2>
        <pre>{responseDetails}</pre>
    </div>

    <div class="instructions">
        <h2>Debugging Guide</h2>
        <ol>
            <li>
                First, click <strong>Test Internal API</strong> to check if your
                app can connect to the internal API route
            </li>
            <li>
                Next, click <strong>Test External API</strong> to check if your app
                can connect directly to the external ticket API
            </li>
            <li>
                If the internal API test fails but the external API test
                succeeds, it may be an Azure Static Web App configuration issue
            </li>
            <li>
                Click <strong>Simulate Purchase Request</strong> to send a complete
                test request and view detailed response
            </li>
            <li>
                Click <strong>Show Environment Info</strong> to check information
                about the current running environment
            </li>
        </ol>
    </div>
</div>

<style>
    .debug-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        font-family: Arial, sans-serif;
        background-color: #242424;
        color: #e0e0e0;
        border-radius: 8px;
    }

    h1,
    h2 {
        color: #ffffff;
    }

    .test-section {
        margin-bottom: 20px;
        padding: 15px;
        background-color: #2a2a2a;
        border-radius: 5px;
    }

    .test-row {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-top: 10px;
    }

    button {
        padding: 8px 16px;
        background-color: #c62828;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 10px;
    }

    button:hover {
        background-color: #e53935;
    }

    button:disabled {
        background-color: #555;
        cursor: not-allowed;
    }

    .status {
        display: inline-block;
        margin-left: 10px;
    }

    .response-section {
        margin-top: 20px;
        padding: 15px;
        background-color: #1a1a1a;
        border-radius: 5px;
    }

    pre {
        background-color: #333;
        padding: 10px;
        border-radius: 5px;
        overflow-x: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .instructions {
        margin-top: 30px;
        padding: 15px;
        background-color: #2a2a2a;
        border-radius: 5px;
    }

    ol {
        padding-left: 20px;
    }

    li {
        margin-bottom: 8px;
    }
</style>
