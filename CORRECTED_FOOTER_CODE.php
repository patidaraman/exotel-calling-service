<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Astra
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

?>
<?php astra_content_bottom(); ?>
	</div> <!-- ast-container -->
	</div><!-- #content -->
<?php
	astra_content_after();

	astra_footer_before();

	astra_footer();

	astra_footer_after();
?>
	</div><!-- #page -->
<?php
	astra_body_bottom();
?>

<!-- Adlync Chatbot Widget - START -->
<style>
.adlync-chatbot-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.adlync-chat-button {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: transparent;
    border: black;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: relative;
    outline: none;
    z-index: 100;
    padding: 100;
}

.adlync-chat-button:hover {
    transform: scale(1.02);
    background: radial-gradient(circle, rgba(42, 179, 98, 0.1) 0%, rgba(42, 179, 98, 0.05) 50%, transparent 70%);
}

.adlync-chat-button:focus {
    outline: none;
    background: radial-gradient(circle, rgba(42, 179, 98, 0.08) 0%, rgba(42, 179, 98, 0.03) 50%, transparent 70%);
}

.adlync-chat-button:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(20, 87, 48, 0.8) 0%, rgba(20, 87, 48, 0.4) 70%, transparent 100%);
    animation: aiPulse 4s infinite;
    z-index: -1;
}

@keyframes aiPulse {
    0% {
        transform: scale(1);
        opacity: 0.9;
    }
    50% {
        transform: scale(1.08);
        opacity: 0.6;
    }
    100% {
        transform: scale(1.15);
        opacity: 0;
    }
}

.adlync-chat-image {
    width: 115px;
    height: 190px;
    border-radius: 50%;
    object-fit: cover;
    transition: all 0.3s ease;
    filter: drop-shadow(0 2px 6px rgba(42, 179, 98, 0.15));
    animation: aiGlow 4s ease-in-out infinite alternate;
}

@keyframes aiGlow {
    0% {
        filter: drop-shadow(0 2px 6px rgba(42, 179, 98, 0.15)) brightness(1);
    }
    100% {
        filter: drop-shadow(0 3px 8px rgba(42, 179, 98, 0.2)) brightness(1.01);
    }
}

.adlync-chat-button:hover .adlync-chat-image {
    transform: scale(1.005);
    filter: drop-shadow(0 3px 8px rgba(42, 179, 98, 0.25)) brightness(1.015);
}

/* Removed square particles - they don't look nice */
/* Ensure no square animations appear */
.adlync-particle,
.adlync-ai-particles,
[class*="particle"],
[class*="square"] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
}

/* Removed square rings - they don't look nice */
.adlync-ai-rings,
.adlync-ring,
[class*="ring"] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
}

.adlync-ai-label {
    position: absolute;
    left: -85px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(42, 179, 98, 0.9);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
    z-index: 5;
}

.adlync-ai-label:after {
    content: '';
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
    border: 8px solid transparent;
    border-left-color: rgba(42, 179, 98, 0.9);
}

.adlync-chatbot-container:hover .adlync-ai-label {
    opacity: 1;
    left: -90px;
}

.adlync-chatbot-container.chat-open .adlync-ai-label {
    opacity: 0 !important;
}

.adlync-chat-window {
    position: absolute;
    bottom: 80px;
    right: 0;
    width: 350px;
    height: 500px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    display: none;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid #e1e5e9;
}

.adlync-chat-header {
    background: linear-gradient(135deg, #2AB362 0%, #179C4C 100%);
    color: white;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid #e5e7eb;
}

.adlync-chat-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
}

.adlync-chat-close {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 20px;
    padding: 4px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    outline: none;
}

.adlync-chat-close:hover {
    background-color: rgba(255,255,255,0.1);
}

.adlync-chat-messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    background: #f8f9fa;
}

.adlync-message {
    margin-bottom: 12px;
    display: flex;
    align-items: flex-start;
}

.adlync-message.user {
    justify-content: flex-end;
}

.adlync-message-content {
    max-width: 80%;
    padding: 10px 14px;
    border-radius: 18px;
    font-size: 14px;
    line-height: 1.4;
    word-wrap: break-word;
}

.adlync-message.bot .adlync-message-content {
    background: white;
    color: #333;
    border: 1px solid #e1e5e9;
}

.adlync-message.user .adlync-message-content {
    background: linear-gradient(135deg, #2AB362 0%, #179C4C 100%);
    color: white;
}

.adlync-chat-input-container {
    padding: 16px;
    border-top: 1px solid #e1e5e9;
    background: white;
}

.adlync-chat-input-form {
    display: flex;
    gap: 8px;
}

.adlync-chat-input {
    flex: 1;
    padding: 10px 14px;
    border: 1px solid #e1e5e9;
    border-radius: 20px;
    outline: none;
    font-size: 14px;
    font-family: inherit;
}

.adlync-chat-input:focus {
    border-color: #2AB362;
    box-shadow: 0 0 0 2px rgba(42, 179, 98, 0.1);
}

.adlync-chat-send {
    padding: 10px 16px;
    background: linear-gradient(135deg, #2AB362 0%, #179C4C 100%);
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    outline: none;
    transition: all 0.2s ease;
}

.adlync-chat-send:hover {
    background: linear-gradient(135deg, #179C4C 0%, #1F7346 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(42, 179, 98, 0.3);
}


.adlync-chat-send:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.adlync-typing-indicator {
    display: none;
    padding: 10px 14px;
    background: white;
    border: 1px solid #e1e5e9;
    border-radius: 18px;
    max-width: 80%;
    margin-bottom: 12px;
}

.adlync-typing-dots {
    display: flex;
    gap: 4px;
}

.adlync-typing-dot {
    width: 6px;
    height: 6px;
    background: #999;
    border-radius: 50%;
    animation: adlyncTyping 1.4s infinite ease-in-out;
}

.adlync-typing-dot:nth-child(1) { animation-delay: -0.32s; }
.adlync-typing-dot:nth-child(2) { animation-delay: -0.16s; }
.adlync-typing-dot:nth-child(3) { animation-delay: 0s; }

@keyframes adlyncTyping {
    0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
}

.adlync-suggested-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
}

.adlync-suggested-action {
    padding: 6px 12px;
    background: #f0f2f5;
    border: 1px solid #e1e5e9;
    border-radius: 16px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    outline: none;
}

.adlync-suggested-action:hover {
    background: #2AB362;
    color: white;
    border-color: #2AB362;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(42, 179, 98, 0.3);
}

.adlync-notification-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ff4757;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    display: none;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    border: 2px solid white;
}

@media (max-width: 480px) {
    .adlync-chatbot-container {
        bottom: 15px;
        right: 15px;
    }
    .adlync-chat-window {
        width: calc(100vw - 30px);
        height: calc(100vh - 90px);
        bottom: 75px;
        right: 0;
    }
    .adlync-chat-button {
        width: 55px;
        height: 55px;
    }
}
</style>

<div class="adlync-chatbot-container">
    <button class="adlync-chat-button" id="adlyncChatButton">
        <img
            src="https://adlyncsolutions.com/wp-content/uploads/2025/07/download.png"
            alt="AI Assistant"
            class="adlync-chat-image"
        />
        <div class="adlync-notification-badge" id="adlyncNotificationBadge">1</div>
    </button>
    <div class="adlync-ai-label">AI Assistant</div>

    <div class="adlync-chat-window" id="adlyncChatWindow">
        <div class="adlync-chat-header">
            <div>
                <h3>Adlync Solutions</h3>
            </div>
            <button class="adlync-chat-close" id="adlyncChatClose">×</button>
        </div>

        <div class="adlync-chat-messages" id="adlyncChatMessages">
            <div class="adlync-message bot">
                <div class="adlync-message-content">
                    👋 Hello! I'm your AI assistant from Adlync Solutions. How can I help you with AI automation today?
                    <div class="adlync-suggested-actions">
                        <button class="adlync-suggested-action" onclick="adlyncSendSuggestion('What services do you offer?')" type="button">Our Services</button>
                        <button class="adlync-suggested-action" onclick="adlyncSendSuggestion('Tell me about AI chatbots')" type="button">AI Chatbots</button>
                        <button class="adlync-suggested-action" onclick="adlyncSendSuggestion('Book free consultation')" type="button">Free Consultation</button>
                    </div>
                </div>
            </div>
            <div class="adlync-typing-indicator" id="adlyncTypingIndicator">
                <div class="adlync-typing-dots">
                    <div class="adlync-typing-dot"></div>
                    <div class="adlync-typing-dot"></div>
                    <div class="adlync-typing-dot"></div>
                </div>
            </div>
        </div>

        <div class="adlync-chat-input-container">
            <form class="adlync-chat-input-form" id="adlyncChatForm">
                <input type="text" class="adlync-chat-input" id="adlyncChatInput" placeholder="Type your message..." autocomplete="off" maxlength="500">
                <button type="submit" class="adlync-chat-send" id="adlyncChatSend">Send</button>
            </form>
        </div>
    </div>
</div>

<script>
(function() {
    'use strict';
    
    const CHATBOT_CONFIG = {
        apiUrl: 'https://1ea0caf1ac19.ngrok-free.app/api/v1/chatbot/chat',
        sessionId: 'adlync-web-' + Math.random().toString(36).substr(2, 9),
        welcomeShown: false,
        maxRetries: 3,
        retryDelay: 1000
    };

    const chatButton = document.getElementById('adlyncChatButton');
    const chatWindow = document.getElementById('adlyncChatWindow');
    const chatClose = document.getElementById('adlyncChatClose');
    const chatMessages = document.getElementById('adlyncChatMessages');
    const chatForm = document.getElementById('adlyncChatForm');
    const chatInput = document.getElementById('adlyncChatInput');
    const chatSend = document.getElementById('adlyncChatSend');
    const typingIndicator = document.getElementById('adlyncTypingIndicator');
    const notificationBadge = document.getElementById('adlyncNotificationBadge');

    if (!chatButton || !chatWindow || !chatClose || !chatMessages || !chatForm || !chatInput || !chatSend || !typingIndicator || !notificationBadge) {
        console.error('Adlync Chatbot: Required DOM elements not found');
        return;
    }

    let isOpen = false;
    let isLoading = false;

    try {
        chatButton.addEventListener('click', toggleChat);
        chatClose.addEventListener('click', closeChat);
        chatForm.addEventListener('submit', handleSubmit);
    } catch (error) {
        console.error('Adlync Chatbot: Error setting up event listeners:', error);
        return;
    }

    function toggleChat() {
        try {
            isOpen = !isOpen;
            chatWindow.style.display = isOpen ? 'flex' : 'none';
            
            // Add/remove chat-open class to hide AI Assistant label when chat is open
            const chatContainer = document.querySelector('.adlync-chatbot-container');
            if (isOpen) {
                chatContainer.classList.add('chat-open');
                chatInput.focus();
                hideNotificationBadge();
                
                if (!CHATBOT_CONFIG.welcomeShown) {
                    setTimeout(() => {
                        showWelcomeMessage();
                        CHATBOT_CONFIG.welcomeShown = true;
                    }, 500);
                }
            } else {
                chatContainer.classList.remove('chat-open');
            }
        } catch (error) {
            console.error('Adlync Chatbot: Error toggling chat:', error);
        }
    }

    function closeChat() {
        try {
            isOpen = false;
            chatWindow.style.display = 'none';
            
            // Remove chat-open class to show AI Assistant label again
            const chatContainer = document.querySelector('.adlync-chatbot-container');
            chatContainer.classList.remove('chat-open');
            
            chatButton.focus();
        } catch (error) {
            console.error('Adlync Chatbot: Error closing chat:', error);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (isLoading) return;
        
        const message = chatInput.value.trim();
        if (message && message.length > 0) {
            sendMessage(message);
            chatInput.value = '';
        }
    }

    async function sendMessage(message, retryCount = 0) {
        if (isLoading) return;
        
        try {
            addMessage(message, 'user');
            setLoadingState(true);
            showTyping();
            
            const response = await fetch(CHATBOT_CONFIG.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: CHATBOT_CONFIG.sessionId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (!data || typeof data.message !== 'string') {
                throw new Error('Invalid response format from server');
            }
            
            setLoadingState(false);
            hideTyping();
            addMessage(data.message, 'bot', data.suggestedActions || []);
            
        } catch (error) {
            console.error('Adlync Chatbot API Error:', error);
            
            setLoadingState(false);
            hideTyping();
            
            if (retryCount < CHATBOT_CONFIG.maxRetries) {
                setTimeout(() => {
                    sendMessage(message, retryCount + 1);
                }, CHATBOT_CONFIG.retryDelay * (retryCount + 1));
                return;
            }
            
            const errorMessage = "I'm having trouble connecting right now. Please visit https://adlyncsolutions.com/ or contact us directly for assistance with AI automation solutions!";
            addMessage(errorMessage, 'bot', ['Visit Website', 'Try Again']);
        }
    }

    function setLoadingState(loading) {
        isLoading = loading;
        chatSend.disabled = loading;
        chatInput.disabled = loading;
    }

    function addMessage(content, sender, suggestedActions = []) {
        try {
            const messageDiv = document.createElement('div');
            messageDiv.className = `adlync-message ${sender}`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'adlync-message-content';
            contentDiv.textContent = content;
            
            if (sender === 'bot' && suggestedActions && suggestedActions.length > 0) {
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'adlync-suggested-actions';
                
                suggestedActions.forEach(action => {
                    const actionBtn = document.createElement('button');
                    actionBtn.className = 'adlync-suggested-action';
                    actionBtn.textContent = action;
                    actionBtn.type = 'button';
                    actionBtn.onclick = () => adlyncSendSuggestion(action);
                    actionsDiv.appendChild(actionBtn);
                });
                
                contentDiv.appendChild(actionsDiv);
            }
            
            messageDiv.appendChild(contentDiv);
            chatMessages.insertBefore(messageDiv, typingIndicator);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            if (!isOpen && sender === 'bot') {
                showNotificationBadge();
            }
            
        } catch (error) {
            console.error('Adlync Chatbot: Error adding message:', error);
        }
    }

    function showTyping() {
        try {
            typingIndicator.style.display = 'block';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (error) {
            console.error('Adlync Chatbot: Error showing typing:', error);
        }
    }

    function hideTyping() {
        try {
            typingIndicator.style.display = 'none';
        } catch (error) {
            console.error('Adlync Chatbot: Error hiding typing:', error);
        }
    }

    function showWelcomeMessage() {
        try {
            setTimeout(() => {
                addMessage(
                    "🚀 Welcome to Adlync Solutions! We're AI automation experts with 5+ years of experience. Our clients often see 300% lead growth and 4hr→30sec response times. How can we help transform your business?",
                    'bot',
                    ['Our Services', 'AI Solutions', 'Free Consultation']
                );
            }, 1000);
        } catch (error) {
            console.error('Adlync Chatbot: Error showing welcome message:', error);
        }
    }

    function showNotificationBadge() {
        try {
            notificationBadge.style.display = 'flex';
            notificationBadge.textContent = '1';
        } catch (error) {
            console.error('Adlync Chatbot: Error showing notification:', error);
        }
    }

    function hideNotificationBadge() {
        try {
            notificationBadge.style.display = 'none';
        } catch (error) {
            console.error('Adlync Chatbot: Error hiding notification:', error);
        }
    }

    window.adlyncSendSuggestion = function(suggestion) {
        try {
            if (suggestion && typeof suggestion === 'string' && !isLoading) {
                sendMessage(suggestion);
            }
        } catch (error) {
            console.error('Adlync Chatbot: Error sending suggestion:', error);
        }
    };

    try {
        console.log('Adlync Chatbot Widget Loaded Successfully');
        
        setTimeout(() => {
            if (!isOpen && !CHATBOT_CONFIG.welcomeShown) {
                showNotificationBadge();
            }
        }, 10000);
        
    } catch (error) {
        console.error('Adlync Chatbot: Initialization error:', error);
    }

})();
</script>
<!-- Adlync Chatbot Widget - END -->

<?php
	wp_footer();
?>
</body>
</html>