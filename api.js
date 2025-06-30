class MailTMAPI {
    constructor() {
        this.baseUrl = 'https://api.mail.tm';
        this.token = null;
    }

    async authenticate(email, password) {
        const response = await fetch(`${this.baseUrl}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: email, password })
        });
        
        if (!response.ok) throw new Error('Authentication failed');
        const data = await response.json();
        this.token = data.token;
        localStorage.setItem('mailtmToken', this.token);
        return data;
    }

    async getMessages(page = 1) {
        const response = await fetch(`${this.baseUrl}/messages?page=${page}`, {
            headers: { Authorization: `Bearer ${this.token}` }
        });
        return await response.json();
    }

    async getMessage(id) {
        const response = await fetch(`${this.baseUrl}/messages/${id}`, {
            headers: { Authorization: `Bearer ${this.token}` }
        });
        return await response.json();
    }
}

const mailApi = new MailTMAPI();
