const fetch = require('node-fetch');

module.exports = async function (context, req) {
    try {
        const data = req.body;
        context.log('Request received:', data);

        const apiEndpoint = 'https://nscc-0424837-ticketapi-augpgqecg5eebkcu.canadacentral-01.azurewebsites.net/api/tickets';

        context.log('Calling external API...');
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        context.log('External API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            context.log('External API error response:', errorText);

            context.res = {
                status: response.status,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                },
                body: JSON.stringify({
                    error: 'Failed to process ticket purchase',
                    details: errorText
                })
            };
            return;
        }

        const responseData = await response.json();
        context.log('External API success response:', responseData);

        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({
                message: 'Ticket purchase successful',
                data: responseData
            })
        };
    } catch (error) {
        context.log.error('Error caught:', error);

        context.res = {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({
                error: 'Server error',
                details: error.message || 'Unknown error'
            })
        };
    }
};

// for CORS preflight requests
module.exports.options = async function (context, req) {
    context.res = {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        body: ""
    };
};