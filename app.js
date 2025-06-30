class EmailApp {
    constructor() {
        this.api = new MailTMAPI();
        this.setupEventListeners();
        this.initializeMercure();
    }

    setupEventListeners() {
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                await this.api.authenticate(email, password);
                this.showEmailDashboard(email);
                this.startPollingMessages();
            } catch (error) {
                alert('Login failed. Please try again.');
            }
        });

        document.getElementById('message-list').addEventListener('click', (e) => {
            const messageId = e.target.closest('.message-item')?.dataset.messageId;
            if (messageId) {
                this.showMessageDetails(messageId);
            }
        });
    }

    async showMessageDetails(messageId) {
        const message = await this.api.getMessage(messageId);
        const detailsContainer = document.getElementById('message-details');
        
        detailsContainer.innerHTML = `
            <h3>${message.subject}</h3>
            <p><strong>From:</strong> ${message.from.name || message.from.address}</p>
            <p><strong>To:</strong> ${message.to[0].address}</p>
            <div class="message-body">
                ${message.html[0]}
            </div>
        `;
        
        detailsContainer.style.display = 'block';
    }

    startPollingMessages() {
        setInterval(async () => {
            const messages = await this.api.getMessages();
            this.updateMessageList(messages['hydra:member']);
        }, 5000);
    }

    updateMessageList(messages) {
        const messageList = document.getElementById('message-list');
        messageList.innerHTML = messages.map(message => `
            <div class="message-item" data-message-id="${message.id}">
                <h4>${message.subject}</h4>
                <div class="message-preview">
                    <span>${message.from.name || message.from.address}</span>
                    <span class="preview-text">${message.intro}</span>
                </div>
            </div>
        `).join('');
    }

    showEmailDashboard(email) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('email-dashboard').style.display = 'block';
        document.getElementById('current-email').textContent = email;
    }

    initializeMercure() {
        const url = new URL('https://mercure.mail.tm/.well-known/mercure');
        url.searchParams.set('topic', 'accounts/{id}');
        
        const eventSource = new EventSource(url.toString());
        
        eventSource.onmessage = async (event) => {
            console.log('New message received:', event.data);
            const messages = await this.api.getMessages();
            this.updateMessageList(messages['hydra:member']);
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EmailApp();
});
