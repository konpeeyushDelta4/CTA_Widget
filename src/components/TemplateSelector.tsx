
// Define template options
const templates = [
    {
        id: 'telegram',
        name: 'Telegram Integration',
        description: 'Connect with customers through Telegram messenger',
        type: 'telegram'
    },
    {
        id: 'whatsapp',
        name: 'WhatsApp Support',
        description: 'Provide customer support via WhatsApp',
        type: 'whatsapp'
    }
]

interface TemplateSelectorProps {
    onSelect: (templateId: string) => void
    selectedTemplate: string | null
    contactInfo: {
        telegramUsername: string
        whatsappNumber: string
    }
    onContactInfoChange: (key: string, value: string) => void
}

export default function TemplateSelector({ 
    onSelect, 
    selectedTemplate,
    contactInfo,
    onContactInfoChange
}: TemplateSelectorProps) {
    return (
        <div className="w-full space-y-6">
            <div className="p-4 border rounded-lg light-mode-card">
                <h2 className="text-xl font-semibold mb-4 light-mode-heading">Choose a template</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => onSelect(template.id)}
                            className={`cursor-pointer rounded-lg p-4 transition-all duration-200 border-2 ${
                                selectedTemplate === template.id 
                                    ? 'selected-template-light' 
                                    : 'hover:border-gray-300 border-transparent light-mode-template-card'
                                }`}
                        >
                            {template.type === 'whatsapp' ? (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4c-4.38 0-7.93 3.55-7.93 7.93a7.9 7.9 0 0 0 1.07 3.98L4 20l4.17-1.1a7.9 7.9 0 0 0 3.78.96h.01c4.38 0 7.93-3.55 7.93-7.93 0-2.12-.82-4.11-2.3-5.6zm-5.55 12.18h-.01a6.56 6.56 0 0 1-3.35-.92l-.24-.14-2.48.65.66-2.42-.16-.25a6.56 6.56 0 0 1-1-3.49c0-3.64 2.96-6.6 6.6-6.6a6.56 6.56 0 0 1 6.6 6.6c0 3.64-2.96 6.6-6.6 6.6z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold light-mode-text">{template.name}</h3>
                                            <p className="text-sm light-mode-text-secondary">{template.description}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-100 rounded p-3 light-mode-message">
                                        <p className="text-sm text-gray-800">Hello! How can I help you today?</p>
                                    </div>

                                    <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors light-mode-button">
                                        Start WhatsApp Chat
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full telegram-accent flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-1.28-.67-2.02-1.1-3.26-1.75-1.44-.76-.5-1.18.32-1.86.21-.18 3.9-3.58 3.97-3.88.01-.04.01-.19-.07-.27-.08-.08-.2-.05-.29-.03-.12.03-2.08 1.32-5.87 3.88-.55.38-1.06.57-1.5.55-.5-.01-1.45-.28-2.16-.51-.87-.28-1.56-.43-1.5-.91.03-.25.26-.5.67-.75 2.65-1.15 4.41-1.9 5.28-2.27 2.52-1.06 3.04-1.24 3.38-1.25.08 0 .26.02.38.12.1.08.13.19.14.27-.01.06-.01.13-.01.2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold light-mode-text">{template.name}</h3>
                                            <p className="text-sm light-mode-text-secondary">{template.description}</p>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 rounded p-3 border-l-4 border-blue-500 light-mode-message">
                                        <p className="text-sm text-blue-800">Connect your Telegram Bot API for seamless communication.</p>
                                    </div>

                                    <button className="w-full telegram-accent text-white py-2 rounded-lg hover:bg-blue-600 transition-colors light-mode-button">
                                        Connect with Telegram
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {selectedTemplate && (
                <div className="p-4 border rounded-lg light-mode-card">
                    <h2 className="text-xl font-semibold mb-4 light-mode-heading">Contact Information</h2>

                    <div className="space-y-4">
                        {selectedTemplate === 'telegram' ? (
                            <div>
                                <label htmlFor="telegramUsername" className="block mb-1 text-sm font-medium light-mode-label">
                                    Telegram Username
                                </label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                                        @
                                    </span>
                                    <input
                                        id="telegramUsername"
                                        type="text"
                                        value={contactInfo.telegramUsername}
                                        onChange={(e) => onContactInfoChange('telegramUsername', e.target.value)}
                                        className="w-full p-2 border rounded-r-md light-mode-input"
                                        placeholder="yourcompany"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Enter your Telegram username without the @ symbol</p>
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="whatsappNumber" className="block mb-1 text-sm font-medium light-mode-label">
                                    WhatsApp Number
                                </label>
                                <input
                                    id="whatsappNumber"
                                    type="text"
                                    value={contactInfo.whatsappNumber}
                                    onChange={(e) => onContactInfoChange('whatsappNumber', e.target.value)}
                                    className="w-full p-2 border rounded light-mode-input"
                                    placeholder="1234567890"
                                />
                                <p className="mt-1 text-xs text-gray-500">Enter your full WhatsApp number with country code (e.g., 15551234567)</p>
                            </div>
                        )}
                        
                        <div>
                            <label htmlFor="welcomeMessage" className="block mb-1 text-sm font-medium light-mode-label">
                                Welcome Message
                            </label>
                            <textarea
                                id="welcomeMessage"
                                className="w-full p-2 border rounded h-24 light-mode-input"
                                placeholder="Enter a welcome message for your customers"
                                defaultValue={
                                    selectedTemplate === 'telegram'
                                        ? 'Welcome to our Telegram support! How can we help you today?'
                                        : 'Hello! Thank you for contacting us on WhatsApp. How may we assist you?'
                                }
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="companyName" className="block mb-1 text-sm font-medium light-mode-label">
                                Company or Agent Name
                            </label>
                            <input
                                id="companyName"
                                type="text"
                                className="w-full p-2 border rounded light-mode-input"
                                placeholder="Enter your company or agent name"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}