/**
 * CTA Widget - Simple JavaScript Chat Widget
 * 
 * This script creates a chat widget for your website that connects
 * to either Telegram or WhatsApp based on the provided parameters.
 * 
 * Usage:
 * <script src="script.js?platform=telegram&username=yourcompany&bottom=20&right=20"></script>
 * OR
 * <script src="script.js?platform=whatsapp&phone=1234567890&country=US&bottom=20&right=20"></script>
 * 
 * Parameters:
 * - platform: 'telegram' or 'whatsapp' (default: 'telegram')
 * - username: Telegram username (for telegram platform)
 * - phone: WhatsApp phone number (for whatsapp platform)
 * - country: Two-letter country code (for whatsapp platform, e.g. 'US', 'GB', 'IN')
 * - message: Default message to send (default: 'Hello! I have a question about your services.')
 * - title: Widget title text (default depends on platform)
 * - subtitle: Widget subtitle text (default: 'Online now')
 * - bottom: Position from bottom in pixels (default: 20)
 * - right: Position from right in pixels (default: 20)
 */

(function () {
  // Parse URL parameters
  var scriptTag = document.currentScript;
  var queryString = scriptTag.src.split('?')[1] || '';
  var params = {};

  if (queryString) {
    queryString.split('&').forEach(function (pair) {
      var parts = pair.split('=');
      params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1] || '');
    });
  }

  // Helper function to convert country code to flag emoji
  function countryCodeToFlag(countryCode) {
    if (!countryCode) return '🌎'; // Default globe emoji

    // Convert country code to regional indicator symbols
    // Each letter A-Z is represented by a Unicode Regional Indicator Symbol
    // A = 0x1F1E6, B = 0x1F1E7, etc.
    const baseCharCode = 0x1F1E6; // Regional Indicator Symbol Letter A
    const baseAscii = 'A'.charCodeAt(0);

    // Convert the two-letter country code to uppercase for consistency
    const code = countryCode.toUpperCase();

    if (code.length !== 2 || !/^[A-Z]{2}$/.test(code)) {
      return '🌎'; // Return default emoji for invalid codes
    }

    // Convert each letter to the corresponding regional indicator symbol
    const firstChar = code.charCodeAt(0) - baseAscii + baseCharCode;
    const secondChar = code.charCodeAt(1) - baseAscii + baseCharCode;

    // Combine the two regional indicator symbols to form the flag
    return String.fromCodePoint(firstChar) + String.fromCodePoint(secondChar);
  }

  // Configuration
  var platform = params.platform || 'telegram';
  var contactInfo = platform === 'telegram' ? params.username || 'yourcompany' : params.phone || '1234567890';
  var welcomeMessage = params.message || 'Hello! I have a question about your services.';
  var title = params.title || (platform === 'telegram' ? 'Telegram Support' : 'WhatsApp Support');
  var subtitle = params.subtitle || 'Online now';

  // Get country code if provided (for WhatsApp)
  var countryCode = params.country || '';
  var flagEmoji = countryCodeToFlag(countryCode);

  // Position configuration (with defaults)
  var bottomPosition = parseInt(params.bottom || 20);
  var rightPosition = parseInt(params.right || 20);

  // Set proper transform origin based on position
  var setTransformOrigin = function (element) {
    // Default to bottom right, but adjust if widget is positioned differently
    var origin = 'bottom right';

    // If widget is positioned at the top half of the viewport
    if (bottomPosition > window.innerHeight / 2) {
      origin = 'top right';
    }

    // If widget is positioned at the left half of the viewport
    if (rightPosition > window.innerWidth / 2) {
      origin = origin.replace('right', 'left');
    }

    element.style.transformOrigin = origin;
  };

  // Base URL for assets (same domain as the script)
  var baseUrl = scriptTag.src.split('?')[0].split('/').slice(0, -1).join('/');

  // Load CSS
  var cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = baseUrl + '/widget.css';
  document.head.appendChild(cssLink);

  // Set theme colors and position
  var style = document.createElement('style');
  style.textContent = `
    :root {
      --widget-color: ${platform === 'telegram' ? '#0088cc' : '#25D366'};
      --widget-hover-color: ${platform === 'telegram' ? '#0077b5' : '#20bc5c'};
      --widget-bottom: ${bottomPosition}px;
      --widget-right: ${rightPosition}px;
    }
  `;
  document.head.appendChild(style);

  // Load platform icon
  function loadIcon(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', baseUrl + '/assets/' + platform + '-icon.svg', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(xhr.responseText);
      } else if (xhr.readyState === 4) {
        // Fallback icons if the SVG files aren't found
        var fallbackIcons = {
          telegram: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
          whatsapp: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>'
        };
        callback(fallbackIcons[platform]);
      }
    };
    xhr.send();
  }

  // Determine which widget to create
  loadIcon(function (icon) {
    if (platform === 'telegram') {
      createTelegramWidget(contactInfo, title, subtitle, icon);
    } else if (platform === 'whatsapp') {
      createWhatsAppWidget(contactInfo, title, subtitle, welcomeMessage, icon);
    }
  });

  // Telegram Widget Implementation
  function createTelegramWidget(username, title, subtitle, icon) {
    // Create widget container
    var container = document.createElement('div');
    container.id = 'telegram-chat-widget';
    document.body.appendChild(container);

    // Create widget button
    var button = document.createElement('button');
    button.className = 'widget-button';
    button.innerHTML = icon;
    button.title = 'Chat with us on Telegram';
    container.appendChild(button);

    // Create chat window (initially hidden)
    var chatWindow = document.createElement('div');
    chatWindow.className = 'chat-window';
    chatWindow.style.display = 'none'; // This is necessary for the toggle functionality

    // Apply transform origin based on widget position
    setTransformOrigin(chatWindow);

    container.appendChild(chatWindow);

    // Create chat header
    var header = document.createElement('div');
    header.className = 'chat-header';
    chatWindow.appendChild(header);

    // Header content
    var headerTitle = document.createElement('div');
    headerTitle.className = 'header-title';

    var logo = document.createElement('div');
    logo.className = 'header-logo';
    logo.innerHTML = icon;
    headerTitle.appendChild(logo);

    var titleText = document.createElement('div');
    titleText.className = 'header-text';
    var titleEl = document.createElement('p');
    titleEl.className = 'header-text-title';
    titleEl.textContent = title || 'Telegram';
    var subtitleEl = document.createElement('p');
    subtitleEl.className = 'header-text-subtitle';
    subtitleEl.textContent = subtitle || 'Company Support';
    titleText.appendChild(titleEl);
    titleText.appendChild(subtitleEl);
    headerTitle.appendChild(titleText);

    header.appendChild(headerTitle);

    var closeBtn = document.createElement('button');
    closeBtn.className = 'close-button';
    closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    header.appendChild(closeBtn);

    // Chat body
    var chatBody = document.createElement('div');
    chatBody.className = 'chat-body';
    chatWindow.appendChild(chatBody);

    // Add initial message
    var initialMessage = document.createElement('div');
    initialMessage.className = 'chat-message telegram-message';
    var messageText = document.createElement('p');
    messageText.textContent = 'Welcome to our support chat! How can we assist you today?';
    initialMessage.appendChild(messageText);
    chatBody.appendChild(initialMessage);

    // Input area
    var inputArea = document.createElement('div');
    inputArea.className = 'input-area';
    chatWindow.appendChild(inputArea);

    var input = document.createElement('input');
    input.className = 'chat-input';
    input.type = 'text';
    input.placeholder = 'Type your message...';
    inputArea.appendChild(input);

    var sendBtn = document.createElement('button');
    sendBtn.className = 'send-button';
    sendBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
    inputArea.appendChild(sendBtn);

    // Toggle chat window when button is clicked
    button.addEventListener('click', function () {
      var isVisible = chatWindow.style.display === 'flex';
      if (isVisible) {
        chatWindow.classList.remove('active');
        setTimeout(function () {
          chatWindow.style.display = 'none';
        }, 300);
      } else {
        chatWindow.style.display = 'flex';
        setTimeout(function () {
          chatWindow.classList.add('active');
        }, 10);
      }
    });

    // Close chat window when close button is clicked
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      chatWindow.classList.remove('active');
      setTimeout(function () {
        chatWindow.style.display = 'none';
      }, 300);
    });

    // Handle send button click - open Telegram
    sendBtn.addEventListener('click', function () {
      var message = input.value.trim();
      if (message) {
        // Add user message
        var userMsg = document.createElement('div');
        userMsg.className = 'chat-message user-message';
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
    input.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        sendBtn.click();
      }
    });
  }

  // WhatsApp Widget Implementation
  function createWhatsAppWidget(phoneNumber, title, subtitle, welcomeMessage, icon) {
    // Create widget container
    var container = document.createElement('div');
    container.id = 'whatsapp-chat-widget';
    document.body.appendChild(container);

    // Create widget button
    var button = document.createElement('button');
    button.className = 'widget-button';
    button.innerHTML = icon;
    button.title = 'Chat with us on WhatsApp';
    container.appendChild(button);

    // Create chat window (initially hidden)
    var chatWindow = document.createElement('div');
    chatWindow.className = 'chat-window';
    chatWindow.style.display = 'none'; // This is necessary for the toggle functionality

    // Apply transform origin based on widget position
    setTransformOrigin(chatWindow);

    container.appendChild(chatWindow);

    // Create chat header
    var header = document.createElement('div');
    header.className = 'chat-header';
    chatWindow.appendChild(header);

    // Header content
    var headerTitle = document.createElement('div');
    headerTitle.className = 'header-title';

    var logo = document.createElement('div');
    logo.className = 'header-logo';
    logo.innerHTML = icon;
    headerTitle.appendChild(logo);

    var titleText = document.createElement('div');
    titleText.className = 'header-text';
    var titleEl = document.createElement('p');
    titleEl.className = 'header-text-title';
    titleEl.textContent = title;

    // Add country flag if available
    if (countryCode) {
      var flagSpan = document.createElement('span');
      flagSpan.className = 'noto-color-emoji-regular';
      flagSpan.textContent = ' ' + flagEmoji;
      flagSpan.style.marginLeft = '5px';
      titleEl.appendChild(flagSpan);
    }

    var subtitleEl = document.createElement('p');
    subtitleEl.className = 'header-text-subtitle';
    subtitleEl.textContent = subtitle;
    titleText.appendChild(titleEl);
    titleText.appendChild(subtitleEl);
    headerTitle.appendChild(titleText);

    header.appendChild(headerTitle);

    var closeBtn = document.createElement('button');
    closeBtn.className = 'close-button';
    closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    header.appendChild(closeBtn);

    // Chat body
    var chatBody = document.createElement('div');
    chatBody.className = 'chat-body whatsapp-chat-body';
    chatWindow.appendChild(chatBody);

    // Format the phone number nicely for display
    var formattedPhone = phoneNumber;
    if (countryCode) {
      // Add country code and format with spaces for better readability
      // This assumes the phone parameter doesn't include country code
      if (!phoneNumber.startsWith('+')) {
        formattedPhone = '+' + phoneNumber;
      }
    }

    // Add initial message
    var initialMessage = document.createElement('div');
    initialMessage.className = 'chat-message whatsapp-message';
    var messageText = document.createElement('p');
    messageText.textContent = 'Greetings! And Welcome To Our Support! How May We Assist You Today?';
    initialMessage.appendChild(messageText);
    chatBody.appendChild(initialMessage);

    // Add phone number message
    var phoneMessage = document.createElement('div');
    phoneMessage.className = 'chat-message whatsapp-message';
    var phoneText = document.createElement('p');
    phoneText.innerHTML = 'You can reach us on WhatsApp: <strong>' + formattedPhone + '</strong>';
    if (countryCode) {
      phoneText.innerHTML += ' ' + flagEmoji;
    }
    phoneMessage.appendChild(phoneText);
    chatBody.appendChild(phoneMessage);

    // Add start chat button
    var startChat = document.createElement('div');
    startChat.className = 'start-chat-area';
    chatWindow.appendChild(startChat);

    var startChatBtn = document.createElement('button');
    startChatBtn.className = 'start-chat-button';

    // Add flag to button if available
    if (countryCode) {
      startChatBtn.innerHTML = '<span class="noto-color-emoji-regular" style="margin-right: 5px;">' + flagEmoji + '</span> ';
      startChatBtn.innerHTML += 'Start Chat with WhatsApp';
    } else {
      startChatBtn.textContent = 'Start Chat with WhatsApp';
    }

    var whatsappIcon = document.createElement('span');
    whatsappIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>';
    startChatBtn.prepend(whatsappIcon);

    startChat.appendChild(startChatBtn);

    // Toggle chat window when button is clicked
    button.addEventListener('click', function () {
      var isVisible = chatWindow.style.display === 'flex';
      if (isVisible) {
        chatWindow.classList.remove('active');
        setTimeout(function () {
          chatWindow.style.display = 'none';
        }, 300);
      } else {
        chatWindow.style.display = 'flex';
        setTimeout(function () {
          chatWindow.classList.add('active');
        }, 10);
      }
    });

    // Close chat window when close button is clicked
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      chatWindow.classList.remove('active');
      setTimeout(function () {
        chatWindow.style.display = 'none';
      }, 300);
    });

    // Open WhatsApp when start chat button is clicked
    startChatBtn.addEventListener('click', function () {
      var fullNumber = phoneNumber;

      // Make sure the phone number has the proper format for WhatsApp
      // WhatsApp requires the number in international format without any special characters
      if (countryCode && !phoneNumber.includes(countryCode)) {
        // If countryCode is not part of the phone number, add it
        fullNumber = countryCode + phoneNumber.replace(/[^0-9]/g, '');
      } else {
        // Otherwise just clean the number of any non-numeric characters
        fullNumber = phoneNumber.replace(/[^0-9]/g, '');
      }

      var url = 'https://wa.me/' + fullNumber + '?text=' + encodeURIComponent(welcomeMessage || 'Hello! I have a question about your services.');
      window.open(url, '_blank');
    });
  }
})();