export async function POST({ request }) {
    try {
        const text = await request.text();

        if (!text || text.trim() === '') {
            return new Response(JSON.stringify({
                error: 'Empty request body'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        let data;
        try {
            data = JSON.parse(text);
            if (data.postalCode) {
                data.postalCode = data.postalCode.replace(/[^a-zA-Z0-9]/g, '');
            }
        } catch (e) {
            return new Response(JSON.stringify({
                error: 'Invalid JSON format',
                details: e instanceof Error ? e.message : String(e)
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        console.log('Received ticket data:', data);

        const apiEndpoint = 'https://nscc-0424837-ticketapi-augpgqecg5eebkcu.canadacentral-01.azurewebsites.net/api/tickets';

        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        console.log('External API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response from external API:', errorText);

            return new Response(JSON.stringify({
                error: 'Failed to process ticket purchase',
                details: errorText
            }), {
                status: response.status,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const responseData = await response.json();
        return new Response(JSON.stringify({
            message: 'Ticket purchased successfully',
            data: responseData
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Server-side error:', error);

        return new Response(JSON.stringify({
            error: 'Server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export function OPTIONS() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}