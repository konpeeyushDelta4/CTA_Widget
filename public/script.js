/**
 * CTA Widget - Simple JavaScript Chat Widget
 * 
 * This script creates a chat widget for your website that connects
 * to either Telegram or WhatsApp based on the provided parameters.
 * 
 * Usage:
 * <script src="script.js?platform=telegram&username=yourcompany"></script>
 * OR
 * <script src="script.js?platform=whatsapp&phone=1234567890"></script>
 */

(function() {
  // Parse URL parameters
  var scriptTag = document.currentScript;
  var queryString = scriptTag.src.split('?')[1] || '';
  var params = {};
  
  if (queryString) {
    queryString.split('&').forEach(function(pair) {
      var parts = pair.split('=');
      params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1] || '');
    });
  }

  // Configuration
  var platform = params.platform || 'telegram';
  var contactInfo = platform === 'telegram' ? params.username || 'yourcompany' : params.phone || '1234567890';
  var welcomeMessage = params.message || 'Hello! I have a question about your services.';
  var title = params.title || (platform === 'telegram' ? 'Telegram Support' : 'WhatsApp Support');
  var subtitle = params.subtitle || 'Online now';
  
  // Determine which widget to create
  if (platform === 'telegram') {
    createTelegramWidget(contactInfo, title, subtitle);
  } else if (platform === 'whatsapp') {
    createWhatsAppWidget(contactInfo, title, subtitle, welcomeMessage);
  }
  
  // Telegram Widget Implementation
  function createTelegramWidget(username, title, subtitle) {
    // Create widget container
    var container = document.createElement('div');
    container.id = 'telegram-chat-widget';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    // Create widget button
    var button = document.createElement('button');
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
    button.style.width = '56px';
    button.style.height = '56px';
    button.style.borderRadius = '50%';
    button.style.backgroundColor = '#0088cc';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    button.style.transition = 'transform 0.3s ease';
    button.title = 'Chat with us on Telegram';
    container.appendChild(button);

    // Create chat window (initially hidden)
    var chatWindow = document.createElement('div');
    chatWindow.style.position = 'absolute';
    chatWindow.style.bottom = '70px';
    chatWindow.style.right = '0';
    chatWindow.style.width = '320px';
    chatWindow.style.height = '400px';
    chatWindow.style.backgroundColor = '#fff';
    chatWindow.style.borderRadius = '12px';
    chatWindow.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    chatWindow.style.display = 'none';
    chatWindow.style.flexDirection = 'column';
    chatWindow.style.overflow = 'hidden';
    chatWindow.style.transition = 'all 0.3s ease';
    chatWindow.style.transform = 'scale(0.9)';
    chatWindow.style.opacity = '0';
    container.appendChild(chatWindow);

    // Create chat header
    var header = document.createElement('div');
    header.style.backgroundColor = '#0088cc';
    header.style.color = '#fff';
    header.style.padding = '12px';
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'space-between';
    chatWindow.appendChild(header);

    // Header content
    var headerTitle = document.createElement('div');
    headerTitle.style.display = 'flex';
    headerTitle.style.alignItems = 'center';
    
    var logo = document.createElement('div');
    logo.style.width = '32px';
    logo.style.height = '32px';
    logo.style.borderRadius = '50%';
    logo.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    logo.style.display = 'flex';
    logo.style.alignItems = 'center';
    logo.style.justifyContent = 'center';
    logo.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
    headerTitle.appendChild(logo);
    
    var titleText = document.createElement('div');
    titleText.style.marginLeft = '10px';
    var titleEl = document.createElement('p');
    titleEl.style.margin = '0';
    titleEl.style.fontWeight = 'bold';
    titleEl.textContent = title || 'Telegram';
    var subtitleEl = document.createElement('p');
    subtitleEl.style.margin = '0';
    subtitleEl.style.fontSize = '12px';
    subtitleEl.style.opacity = '0.8';
    subtitleEl.textContent = subtitle || 'Company Support';
    titleText.appendChild(titleEl);
    titleText.appendChild(subtitleEl);
    headerTitle.appendChild(titleText);
    
    header.appendChild(headerTitle);
    
    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    closeBtn.style.backgroundColor = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.color = '#fff';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.padding = '4px';
    header.appendChild(closeBtn);

    // Chat body
    var chatBody = document.createElement('div');
    chatBody.style.padding = '16px';
    chatBody.style.overflowY = 'auto';
    chatBody.style.flex = '1';
    chatBody.style.backgroundColor = '#f4f4f4';
    chatWindow.appendChild(chatBody);

    // Add initial message
    var initialMessage = document.createElement('div');
    initialMessage.style.backgroundColor = '#e3f2fd';
    initialMessage.style.borderRadius = '8px';
    initialMessage.style.padding = '10px';
    initialMessage.style.marginBottom = '10px';
    initialMessage.style.maxWidth = '80%';
    initialMessage.style.borderLeft = '4px solid #0088cc';
    var messageText = document.createElement('p');
    messageText.style.margin = '0';
    messageText.style.color = '#0d47a1';
    messageText.textContent = 'Welcome to our support chat! How can we assist you today?';
    initialMessage.appendChild(messageText);
    chatBody.appendChild(initialMessage);

    // Input area
    var inputArea = document.createElement('div');
    inputArea.style.padding = '10px';
    inputArea.style.borderTop = '1px solid #e0e0e0';
    inputArea.style.display = 'flex';
    chatWindow.appendChild(inputArea);

    var input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type your message...';
    input.style.flex = '1';
    input.style.padding = '8px 12px';
    input.style.border = '1px solid #ccc';
    input.style.borderRadius = '24px 0 0 24px';
    input.style.outline = 'none';
    inputArea.appendChild(input);

    var sendBtn = document.createElement('button');
    sendBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
    sendBtn.style.backgroundColor = '#0088cc';
    sendBtn.style.border = 'none';
    sendBtn.style.borderRadius = '0 24px 24px 0';
    sendBtn.style.color = 'white';
    sendBtn.style.padding = '8px 16px';
    sendBtn.style.cursor = 'pointer';
    inputArea.appendChild(sendBtn);

    // Toggle chat window when button is clicked
    button.addEventListener('click', function() {
      var isVisible = chatWindow.style.display === 'flex';
      if (isVisible) {
        chatWindow.style.opacity = '0';
        chatWindow.style.transform = 'scale(0.9)';
        setTimeout(function() {
          chatWindow.style.display = 'none';
        }, 300);
      } else {
        chatWindow.style.display = 'flex';
        setTimeout(function() {
          chatWindow.style.opacity = '1';
          chatWindow.style.transform = 'scale(1)';
        }, 10);
      }
    });

    // Close chat window when close button is clicked
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      chatWindow.style.opacity = '0';
      chatWindow.style.transform = 'scale(0.9)';
      setTimeout(function() {
        chatWindow.style.display = 'none';
      }, 300);
    });

    // Handle send button click - open Telegram
    sendBtn.addEventListener('click', function() {
      var message = input.value.trim();
      if (message) {
        // Add user message
        var userMsg = document.createElement('div');
        userMsg.style.backgroundColor = '#e0e0e0';
        userMsg.style.borderRadius = '8px';
        userMsg.style.padding = '10px';
        userMsg.style.marginBottom = '10px';
        userMsg.style.maxWidth = '80%';
        userMsg.style.marginLeft = 'auto';
        userMsg.style.color = '#333';
        userMsg.textContent = message;
        chatBody.appendChild(userMsg);
        
        // Clear input
        input.value = '';
        
        // Scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;
        
        // Open Telegram in new tab
        var telegramUrl = 'https://t.me/' + username;
        window.open(telegramUrl, '_blank');
      }
    });

    // Handle Enter key in input
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendBtn.click();
      }
    });
  }

  // WhatsApp Widget Implementation
  function createWhatsAppWidget(phoneNumber, title, subtitle, welcomeMessage) {
    // Create widget container
    var container = document.createElement('div');
    container.id = 'whatsapp-chat-widget';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    // Create widget button
    var button = document.createElement('button');
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>';
    button.style.width = '56px';
    button.style.height = '56px';
    button.style.borderRadius = '50%';
    button.style.backgroundColor = '#25D366';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    button.style.transition = 'transform 0.3s ease';
    button.title = 'Chat with us on WhatsApp';
    container.appendChild(button);

    // Create chat window (initially hidden)
    var chatWindow = document.createElement('div');
    chatWindow.style.position = 'absolute';
    chatWindow.style.bottom = '70px';
    chatWindow.style.right = '0';
    chatWindow.style.width = '320px';
    chatWindow.style.backgroundColor = '#fff';
    chatWindow.style.borderRadius = '12px';
    chatWindow.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    chatWindow.style.display = 'none';
    chatWindow.style.flexDirection = 'column';
    chatWindow.style.overflow = 'hidden';
    chatWindow.style.transition = 'all 0.3s ease';
    chatWindow.style.transform = 'scale(0.9)';
    chatWindow.style.opacity = '0';
    container.appendChild(chatWindow);

    // Create chat header
    var header = document.createElement('div');
    header.style.backgroundColor = '#25D366';
    header.style.color = '#fff';
    header.style.padding = '12px';
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'space-between';
    chatWindow.appendChild(header);

    // Header content
    var headerTitle = document.createElement('div');
    headerTitle.style.display = 'flex';
    headerTitle.style.alignItems = 'center';
    
    var logo = document.createElement('div');
    logo.style.width = '32px';
    logo.style.height = '32px';
    logo.style.borderRadius = '50%';
    logo.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    logo.style.display = 'flex';
    logo.style.alignItems = 'center';
    logo.style.justifyContent = 'center';
    logo.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>';
    headerTitle.appendChild(logo);
    
    var titleText = document.createElement('div');
    titleText.style.marginLeft = '10px';
    var titleEl = document.createElement('p');
    titleEl.style.margin = '0';
    titleEl.style.fontWeight = 'bold';
    titleEl.textContent = title;
    var subtitleEl = document.createElement('p');
    subtitleEl.style.margin = '0';
    subtitleEl.style.fontSize = '12px';
    subtitleEl.style.opacity = '0.8';
    subtitleEl.textContent = subtitle;
    titleText.appendChild(titleEl);
    titleText.appendChild(subtitleEl);
    headerTitle.appendChild(titleText);
    
    header.appendChild(headerTitle);
    
    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    closeBtn.style.backgroundColor = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.color = '#fff';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.padding = '4px';
    header.appendChild(closeBtn);

    // Chat body
    var chatBody = document.createElement('div');
    chatBody.style.padding = '16px';
    chatBody.style.overflowY = 'auto';
    chatBody.style.flex = '1';
    chatBody.style.height = '260px';
    chatBody.style.backgroundColor = '#ECE5DD';
    chatWindow.appendChild(chatBody);

    // Add initial message
    var initialMessage = document.createElement('div');
    initialMessage.style.backgroundColor = '#DCF8C6';
    initialMessage.style.borderRadius = '8px';
    initialMessage.style.padding = '10px';
    initialMessage.style.marginBottom = '10px';
    initialMessage.style.maxWidth = '80%';
    var messageText = document.createElement('p');
    messageText.style.margin = '0';
    messageText.style.color = '#303030';
    messageText.textContent = 'Greetings! And Welcome To Our Support! How May We Assist You Today?';
    initialMessage.appendChild(messageText);
    chatBody.appendChild(initialMessage);

    // Add start chat button
    var startChat = document.createElement('div');
    startChat.style.padding = '16px';
    startChat.style.borderTop = '1px solid #E0E0E0';
    startChat.style.backgroundColor = '#f5f5f5';
    chatWindow.appendChild(startChat);

    var startChatBtn = document.createElement('button');
    startChatBtn.textContent = 'Start Chat with WhatsApp';
    startChatBtn.style.backgroundColor = '#25D366';
    startChatBtn.style.color = 'white';
    startChatBtn.style.border = 'none';
    startChatBtn.style.borderRadius = '24px';
    startChatBtn.style.padding = '12px 16px';
    startChatBtn.style.width = '100%';
    startChatBtn.style.cursor = 'pointer';
    startChatBtn.style.fontWeight = 'bold';
    startChatBtn.style.display = 'flex';
    startChatBtn.style.alignItems = 'center';
    startChatBtn.style.justifyContent = 'center';
    
    var whatsappIcon = document.createElement('span');
    whatsappIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>';
    startChatBtn.prepend(whatsappIcon);
    
    startChat.appendChild(startChatBtn);

    // Toggle chat window when button is clicked
    button.addEventListener('click', function() {
      var isVisible = chatWindow.style.display === 'flex';
      if (isVisible) {
        chatWindow.style.opacity = '0';
        chatWindow.style.transform = 'scale(0.9)';
        setTimeout(function() {
          chatWindow.style.display = 'none';
        }, 300);
      } else {
        chatWindow.style.display = 'flex';
        setTimeout(function() {
          chatWindow.style.opacity = '1';
          chatWindow.style.transform = 'scale(1)';
        }, 10);
      }
    });

    // Close chat window when close button is clicked
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      chatWindow.style.opacity = '0';
      chatWindow.style.transform = 'scale(0.9)';
      setTimeout(function() {
        chatWindow.style.display = 'none';
      }, 300);
    });

    // Open WhatsApp when start chat button is clicked
    startChatBtn.addEventListener('click', function() {
      var url = 'https://wa.me/' + phoneNumber + '?text=' + encodeURIComponent(welcomeMessage || 'Hello! I have a question about your services.');
      window.open(url, '_blank');
    });
  }
})();