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

  // Base URL for assets (same domain as the script)
  var baseUrl = scriptTag.src.split('?')[0].split('/').slice(0, -1).join('/');

  // Configuration paths
  var configPaths = {
    global: baseUrl + '/config/templates/widget-config.json',
    whatsapp: baseUrl + '/config/templates/whatsapp/whatsapp-template.json',
    telegram: baseUrl + '/config/templates/telegram/telegram-template.json'
  };

  // CSS paths
  var cssPaths = {
    base: baseUrl + '/widget.css',
    whatsapp: baseUrl + '/style/whatsapp/whatsapp.css',
    telegram: baseUrl + '/style/telegram/telegram.css'
  };

  // Global configuration object
  var config = {
    global: {},
    template: {}
  };

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

  // Load CSS files
  function loadCSS(path) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = path;
    document.head.appendChild(link);
  }

  // Fetch JSON configuration files
  function fetchConfig(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            var responseData = JSON.parse(xhr.responseText);
            callback(null, responseData);
          } catch (e) {
            callback(new Error('Invalid JSON: ' + e.message), null);
          }
        } else {
          // If config file not found, continue with defaults
          callback(new Error('Failed to load config: ' + xhr.status), null);
        }
      }
    };
    xhr.send();
  }

  // Set proper transform origin based on position
  var setTransformOrigin = function (element, bottomPos, rightPos) {
    // Default to bottom right, but adjust if widget is positioned differently
    var origin = 'bottom right';

    // If widget is positioned at the top half of the viewport
    if (bottomPos > window.innerHeight / 2) {
      origin = 'top right';
    }

    // If widget is positioned at the left half of the viewport
    if (rightPos > window.innerWidth / 2) {
      origin = origin.replace('right', 'left');
    }

    element.style.transformOrigin = origin;
  };

  // Load platform icon
  function loadIcon(iconPath, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', baseUrl + iconPath, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(xhr.responseText);
      } else if (xhr.readyState === 4) {
        // Fallback icons if the SVG files aren't found
        var fallbackIcons = {
          telegram: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
          whatsapp: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>'
        };

        // Use the platform as fallback if iconPath doesn't contain the platform name
        var platform = params.platform || 'telegram';
        callback(fallbackIcons[platform]);
      }
    };
    xhr.send();
  }

  // Initialize widget based on configuration
  function initWidget() {
    // Load base CSS file
    loadCSS(cssPaths.base);
    
    // Load global configuration
    fetchConfig(configPaths.global, function (err, globalConfig) {
      if (!err && globalConfig) {
        config.global = globalConfig;
      }

      // Platform (default to telegram if not specified)
      var platform = params.platform || 'telegram';
      
      // Load platform-specific CSS
      loadCSS(cssPaths[platform]);

      // Load platform-specific configuration and initialize widget
      fetchConfig(configPaths[platform], function (err, templateConfig) {
        if (!err && templateConfig) {
          config.template = templateConfig;
        }
        setupWidget(platform);
      });
    });
  }

  // Setup widget based on platform
  function setupWidget(platform) {
    var bottomPosition = parseInt(params.bottom) || config.global.layout?.position?.defaultY || 20;
    var rightPosition = parseInt(params.right) || config.global.layout?.position?.defaultX || 20;
    
    // Get platform-specific icon
    var iconPath = config.template.platformSpecific?.iconPath || '/assets/' + platform + '-icon.svg';
    
    loadIcon(iconPath, function (iconSvg) {
      if (platform === 'telegram') {
        // Get Telegram-specific parameters
        var username = params.username || '';
        var title = params.title || config.template.platformSpecific?.name || 'Telegram Support';
        var subtitle = params.subtitle || config.template.dataFields?.find(field => field.name === 'subtitle')?.defaultValue || 'Online now';
        
        createTelegramWidget(username, title, subtitle, iconSvg, bottomPosition, rightPosition);
      } else if (platform === 'whatsapp') {
        // Get WhatsApp-specific parameters
        var phoneNumber = params.phone || '';
        var countryCode = params.country || '';
        var flagEmoji = countryCodeToFlag(countryCode);
        var welcomeMessage = params.message || config.template.messages?.initial?.[0] || 'Hello! I have a question about your services.';
        var title = params.title || config.template.platformSpecific?.name || 'WhatsApp Support';
        var subtitle = params.subtitle || config.template.dataFields?.find(field => field.name === 'subtitle')?.defaultValue || 'Online now';
        
        createWhatsAppWidget(phoneNumber, title, subtitle, welcomeMessage, iconSvg, bottomPosition, rightPosition, countryCode, flagEmoji);
      }
    });
  }

  // Create Telegram Widget
  function createTelegramWidget(username, title, subtitle, icon, bottomPosition, rightPosition) {
    // Create widget container
    var container = document.createElement('div');
    container.id = 'telegram-chat-widget';
    container.className = 'chat-widget';
    
    // Set CSS variables for positioning
    container.style.setProperty('--widget-bottom', bottomPosition + 'px');
    container.style.setProperty('--widget-right', rightPosition + 'px');
    container.style.setProperty('--widget-color', config.template.platformSpecific?.color || '#0088cc');
    container.style.setProperty('--widget-hover-color', config.template.platformSpecific?.hoverColor || '#0077b5');
    
    // Create button
    var button = document.createElement('button');
    button.className = 'widget-button';
    button.setAttribute('aria-label', 'Open chat');
    button.innerHTML = icon;
    
    // Create chat window
    var chatWindow = document.createElement('div');
    chatWindow.className = 'chat-window';
    
    // Apply animation settings from config
    if (config.global.layout?.animation?.slideIn) {
      chatWindow.style.animation = 'slideIn 0.3s ease-out forwards';
    } else if (config.global.layout?.animation?.fadeIn) {
      chatWindow.style.animation = 'fadeIn 0.3s ease-out forwards';
    }
    
    // Disable button pulse animation if configured
    if (!config.global.layout?.animation?.pulse) {
      button.style.animation = 'none';
    }
    
    // Set transform origin based on position
    setTransformOrigin(chatWindow, bottomPosition, rightPosition);
    
    // Create chat header
    var header = document.createElement('div');
    header.className = 'chat-header';
    
    var headerTitle = document.createElement('div');
    headerTitle.className = 'header-title';
    
    var logoDiv = document.createElement('div');
    logoDiv.className = 'header-logo';
    logoDiv.innerHTML = icon;
    
    var headerTextDiv = document.createElement('div');
    headerTextDiv.className = 'header-text';
    
    var titleElem = document.createElement('div');
    titleElem.className = 'header-text-title';
    titleElem.textContent = title;
    
    var subtitleElem = document.createElement('div');
    subtitleElem.className = 'header-text-subtitle';
    subtitleElem.textContent = subtitle;
    
    headerTextDiv.appendChild(titleElem);
    headerTextDiv.appendChild(subtitleElem);
    
    headerTitle.appendChild(logoDiv);
    headerTitle.appendChild(headerTextDiv);
    
    var closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.setAttribute('aria-label', 'Close chat');
    closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    
    header.appendChild(headerTitle);
    header.appendChild(closeButton);
    
    // Create chat body
    var body = document.createElement('div');
    body.className = 'chat-body';
    
    // Add initial greeting message
    var initialMessages = config.template.messages?.initial || ['Welcome to our support chat! How can we assist you today?'];
    
    initialMessages.forEach(function(messageText) {
      var message = document.createElement('div');
      message.className = 'chat-message telegram-message';
      
      var paragraph = document.createElement('p');
      paragraph.textContent = messageText;
      
      message.appendChild(paragraph);
      body.appendChild(message);
    });
    
    // Create input area
    var inputArea = document.createElement('div');
    inputArea.className = 'input-area';
    
    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'chat-input';
    input.placeholder = config.template.messages?.inputPlaceholder || 'Type your message...';
    
    var sendButton = document.createElement('button');
    sendButton.className = 'send-button';
    sendButton.setAttribute('aria-label', 'Send message');
    sendButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
    
    inputArea.appendChild(input);
    inputArea.appendChild(sendButton);
    
    // Build chat window
    chatWindow.appendChild(header);
    chatWindow.appendChild(body);
    chatWindow.appendChild(inputArea);
    
    // Add components to container
    container.appendChild(button);
    container.appendChild(chatWindow);
    
    // Append to body
    document.body.appendChild(container);
    
    // Event Listeners
    button.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent event bubbling
      chatWindow.classList.toggle('active');
      
      // Scroll to bottom of chat when opened
      body.scrollTop = body.scrollHeight;
      
      // Focus input when chat is opened
      if (chatWindow.classList.contains('active')) {
        input.focus();
      }
    });
    
    closeButton.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent event bubbling
      chatWindow.classList.remove('active');
    });
    
    // Handle messages
    function handleSendMessage() {
      var messageText = input.value.trim();
      
      if (messageText) {
        // Add user message to chat
        var userMessage = document.createElement('div');
        userMessage.className = 'chat-message user-message';
        
        var paragraph = document.createElement('p');
        paragraph.textContent = messageText;
        
        userMessage.appendChild(paragraph);
        body.appendChild(userMessage);
        
        // Clear input
        input.value = '';
        
        // Scroll to bottom
        body.scrollTop = body.scrollHeight;
        
        // Open Telegram in new tab after delay
        setTimeout(function() {
          var telegramUrl = 'https://t.me/' + username;
          window.open(telegramUrl, '_blank');
          
          // Close chat window after sending message
          chatWindow.classList.remove('active');
        }, 500);
      }
    }
    
    sendButton.addEventListener('click', handleSendMessage);
    
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    });
    
    // Click outside to close
    if (config.global.behavior?.closeOnClickOutside) {
      document.addEventListener('click', function(event) {
        var isClickInside = container.contains(event.target);
        
        if (!isClickInside && chatWindow.classList.contains('active')) {
          chatWindow.classList.remove('active');
        }
      });
    }
    
    // Auto-open the widget on load if configured
    if (config.global.behavior?.openOnLoad) {
      setTimeout(function() {
        chatWindow.classList.add('active');
        input.focus();
      }, config.global.behavior.delayBeforeShow || 0);
    }
  }

  // Create WhatsApp Widget
  function createWhatsAppWidget(phoneNumber, title, subtitle, welcomeMessage, icon, bottomPosition, rightPosition, countryCode, flagEmoji) {
    // Create widget container
    var container = document.createElement('div');
    container.id = 'whatsapp-chat-widget';
    container.className = 'chat-widget';
    
    // Set CSS variables for positioning
    container.style.setProperty('--widget-bottom', bottomPosition + 'px');
    container.style.setProperty('--widget-right', rightPosition + 'px');
    container.style.setProperty('--widget-color', config.template.platformSpecific?.color || '#25D366');
    container.style.setProperty('--widget-hover-color', config.template.platformSpecific?.hoverColor || '#20bc5c');
    
    // Create button
    var button = document.createElement('button');
    button.className = 'widget-button';
    button.setAttribute('aria-label', 'Open chat');
    button.innerHTML = icon;
    
    // Create chat window
    var chatWindow = document.createElement('div');
    chatWindow.className = 'chat-window';
    
    // Apply animation settings from config
    if (config.global.layout?.animation?.slideIn) {
      chatWindow.style.animation = 'slideIn 0.3s ease-out forwards';
    } else if (config.global.layout?.animation?.fadeIn) {
      chatWindow.style.animation = 'fadeIn 0.3s ease-out forwards';
    }
    
    // Disable button pulse animation if configured
    if (!config.global.layout?.animation?.pulse) {
      button.style.animation = 'none';
    }
    
    // Set transform origin based on position
    setTransformOrigin(chatWindow, bottomPosition, rightPosition);
    
    // Create chat header
    var header = document.createElement('div');
    header.className = 'chat-header';
    
    var headerTitle = document.createElement('div');
    headerTitle.className = 'header-title';
    
    var logoDiv = document.createElement('div');
    logoDiv.className = 'header-logo';
    logoDiv.innerHTML = icon;
    
    var headerTextDiv = document.createElement('div');
    headerTextDiv.className = 'header-text';
    
    var titleElem = document.createElement('div');
    titleElem.className = 'header-text-title';
    titleElem.textContent = title;
    
    var subtitleElem = document.createElement('div');
    subtitleElem.className = 'header-text-subtitle';
    subtitleElem.textContent = subtitle;
    
    headerTextDiv.appendChild(titleElem);
    headerTextDiv.appendChild(subtitleElem);
    
    headerTitle.appendChild(logoDiv);
    headerTitle.appendChild(headerTextDiv);
    
    var closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.setAttribute('aria-label', 'Close chat');
    closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    
    header.appendChild(headerTitle);
    header.appendChild(closeButton);
    
    // Create chat body with WhatsApp style
    var body = document.createElement('div');
    body.className = 'chat-body';
    
    // Add initial greeting messages
    var initialMessages = config.template.messages?.initial || ['Welcome to our support chat! How can we assist you today?'];
    
    initialMessages.forEach(function(messageText) {
      // Replace placeholders in the message
      var processedMessage = messageText
        .replace('{phone}', phoneNumber)
        .replace('{flag}', '<span class="noto-color-emoji-regular country-flag">' + flagEmoji + '</span>');
      
      var message = document.createElement('div');
      message.className = 'chat-message agent-message';
      
      var paragraph = document.createElement('p');
      paragraph.innerHTML = processedMessage;
      
      message.appendChild(paragraph);
      body.appendChild(message);
    });
    
    // Create start chat area
    var startChatArea = document.createElement('div');
    startChatArea.className = 'start-chat-area';
    
    var startChatButton = document.createElement('button');
    startChatButton.className = 'start-chat-button';
    startChatButton.innerHTML = icon + (config.template.messages?.buttonText || 'Chat with us on WhatsApp');
    startChatButton.style.backgroundColor = config.template.platformSpecific?.color || '#25D366';
    
    startChatArea.appendChild(startChatButton);
    
    // Build chat window
    chatWindow.appendChild(header);
    chatWindow.appendChild(body);
    chatWindow.appendChild(startChatArea);
    
    // Add components to container
    container.appendChild(button);
    container.appendChild(chatWindow);
    
    // Append to body
    document.body.appendChild(container);
    
    // Event Listeners
    button.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent event bubbling
      chatWindow.classList.toggle('active');
      
      // Scroll to bottom of chat when opened
      body.scrollTop = body.scrollHeight;
    });
    
    closeButton.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent event bubbling
      chatWindow.classList.remove('active');
    });
    
    // Open WhatsApp when button is clicked
    startChatButton.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent event bubbling
      var encodedMessage = encodeURIComponent(welcomeMessage);
      var whatsappUrl = 'https://wa.me/' + (countryCode ? countryCode : '') + phoneNumber + '?text=' + encodedMessage;
      window.open(whatsappUrl, '_blank');
      
      // Close chat window after clicking
      chatWindow.classList.remove('active');
    });
    
    // Click outside to close
    if (config.global.behavior?.closeOnClickOutside) {
      document.addEventListener('click', function(event) {
        var isClickInside = container.contains(event.target);
        
        if (!isClickInside && chatWindow.classList.contains('active')) {
          chatWindow.classList.remove('active');
        }
      });
    }
    
    // Auto-open the widget on load if configured
    if (config.global.behavior?.openOnLoad) {
      setTimeout(function() {
        chatWindow.classList.add('active');
      }, config.global.behavior.delayBeforeShow || 0);
    }
  }

  // Initialize the widget
  initWidget();
})();