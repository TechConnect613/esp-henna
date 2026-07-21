export default async function handler(req, res) {
    // Allow only POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { code } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    const clientId = process.env.SUMUP_CLIENT_ID;
    const clientSecret = process.env.SUMUP_CLIENT_SECRET;
    const redirectUri = process.env.SUMUP_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
        return res.status(500).json({ error: 'Missing environment variables' });
    }

    try {
        const response = await fetch('https://api.sumup.com/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
            }),
        });

        const data = await response.json();
        
        if (response.ok) {
            res.status(200).json(data);
        } else {
            res.status(response.status).json(data);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}