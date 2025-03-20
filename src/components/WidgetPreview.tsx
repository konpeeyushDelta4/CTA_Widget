import { useState, useEffect } from 'react'

interface WidgetPreviewProps {
    selectedTemplate: string
    position: {
        bottom: number
        right: number
    }
}

function WidgetPreview({ selectedTemplate, position }: WidgetPreviewProps) {
    const [showWidget, setShowWidget] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        // Reset widget state when template changes
        setShowWidget(false)
    }, [selectedTemplate])

    const toggleWidget = () => {
        setIsAnimating(true)
        setShowWidget(!showWidget)
        // Reset animation state after animation completes
        setTimeout(() => {
            setIsAnimating(false)
        }, 300)
    }

    return (
        <div className="relative w-full h-full min-h-[350px] flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
                <span className="text-xl mb-2">👆</span>
                <p>Click the {selectedTemplate === 'whatsapp' ? 'WhatsApp' : 'Telegram'} button in the corner to see the widget</p>
            </div>

            {/* Widget button */}
            <button
                onClick={toggleWidget}
                className={`absolute rounded-full shadow-lg flex items-center justify-center z-10 w-14 h-14 transition-all duration-300 hover:scale-110 ${selectedTemplate === 'whatsapp'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                style={{
                    bottom: `${position.bottom}px`,
                    right: `${position.right}px`,
                }}
            >
                {selectedTemplate === 'whatsapp' ? (
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M23.734 4.207C21.379 1.85 18.297 0.555 15.048 0.553C8.366 0.553 2.922 5.994 2.919 12.679C2.918 14.753 3.442 16.774 4.434 18.569L2.805 25.447L9.846 23.855C11.573 24.756 13.493 25.226 15.443 25.227H15.448C22.129 25.227 27.573 19.785 27.576 13.1C27.577 9.857 26.288 6.767 23.734 4.207ZM15.048 23.281H15.044C13.293 23.281 11.576 22.83 10.074 21.976L9.679 21.743L5.507 22.695L6.48 18.638L6.221 18.227C5.276 16.666 4.768 14.852 4.769 12.98C4.771 7.065 9.358 2.25 15.052 2.25C17.724 2.251 20.255 3.334 22.184 5.269C24.112 7.205 25.192 9.742 25.191 12.423C25.188 18.338 20.601 23.153 15.048 23.281ZM20.911 15.422C20.562 15.248 18.903 14.433 18.582 14.315C18.261 14.196 18.027 14.138 17.792 14.487C17.558 14.836 16.91 15.592 16.705 15.828C16.5 16.063 16.294 16.093 15.946 15.919C15.598 15.745 14.523 15.418 13.251 14.283C12.257 13.397 11.593 12.3 11.388 11.952C11.182 11.603 11.368 11.413 11.544 11.238C11.704 11.081 11.9 10.827 12.077 10.621C12.254 10.415 12.311 10.267 12.429 10.033C12.548 9.798 12.489 9.593 12.4 9.419C12.311 9.244 11.65 7.585 11.357 6.887C11.073 6.212 10.783 6.303 10.567 6.292C10.362 6.282 10.128 6.28 9.893 6.28C9.659 6.28 9.279 6.369 8.958 6.718C8.637 7.066 7.764 7.882 7.764 9.541C7.764 11.2 8.987 12.8 9.163 13.034C9.34 13.269 11.59 16.718 15.003 18.161C15.842 18.511 16.496 18.719 17.004 18.875C17.85 19.136 18.619 19.097 19.225 19.006C19.902 18.904 21.261 18.189 21.554 17.372C21.847 16.554 21.847 15.855 21.758 15.709C21.669 15.564 21.435 15.48 21.086 15.305C20.737 15.13 20.911 15.422 20.911 15.422Z" fill="white" />
                    </svg>
                ) : (
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 0C6.268 0 0 6.268 0 14C0 21.732 6.268 28 14 28C21.732 28 28 21.732 28 14C28 6.268 21.732 0 14 0ZM20.897 9.554C20.646 12.356 19.354 18.287 18.699 20.884C18.417 21.994 17.857 22.365 17.324 22.408C16.166 22.502 15.282 21.625 14.154 20.873C12.388 19.686 11.371 18.936 9.646 17.772C7.655 16.442 8.962 15.711 10.129 14.525C10.435 14.213 15.5 9.623 15.595 9.212C15.607 9.159 15.619 8.955 15.493 8.843C15.367 8.73 15.182 8.771 15.043 8.802C14.853 8.845 12.2 10.566 7.087 14.004C6.349 14.5 5.681 14.741 5.082 14.728C4.425 14.715 3.164 14.356 2.232 14.048C1.092 13.669 0.189 13.47 0.272 12.83C0.315 12.497 0.763 12.159 1.616 11.815C7.087 9.451 10.67 7.922 12.364 7.23C17.153 5.231 18.235 4.881 18.93 4.881C19.075 4.881 19.406 4.918 19.617 5.091C19.789 5.228 19.854 5.42 19.872 5.552C19.897 5.754 19.923 6.383 19.897 6.881C19.841 8.052 20.029 8.998 20.897 9.554Z" fill="white" />
                    </svg>
                )}
            </button>

            {/* Widget popup */}
            <div
                className={`absolute shadow-lg rounded-lg w-72 max-w-[90%] max-h-[300px] z-20 overflow-hidden flex flex-col transition-all duration-300 ${showWidget
                        ? 'opacity-100 transform translate-y-0'
                        : 'opacity-0 pointer-events-none transform translate-y-8'
                    } ${selectedTemplate === 'whatsapp' ? 'bg-white' : 'bg-white'}`}
                style={{
                    bottom: `${position.bottom + 70}px`,
                    right: `${position.right}px`,
                }}
            >
                {/* Header */}
                <div className={`p-4 text-white ${selectedTemplate === 'whatsapp' ? 'bg-green-500' : 'bg-blue-500'}`}>
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                            {selectedTemplate === 'whatsapp' ? (
                                <svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M23.734 4.207C21.379 1.85 18.297 0.555 15.048 0.553C8.366 0.553 2.922 5.994 2.919 12.679C2.918 14.753 3.442 16.774 4.434 18.569L2.805 25.447L9.846 23.855C11.573 24.756 13.493 25.226 15.443 25.227H15.448C22.129 25.227 27.573 19.785 27.576 13.1C27.577 9.857 26.288 6.767 23.734 4.207ZM15.048 23.281H15.044C13.293 23.281 11.576 22.83 10.074 21.976L9.679 21.743L5.507 22.695L6.48 18.638L6.221 18.227C5.276 16.666 4.768 14.852 4.769 12.98C4.771 7.065 9.358 2.25 15.052 2.25C17.724 2.251 20.255 3.334 22.184 5.269C24.112 7.205 25.192 9.742 25.191 12.423C25.188 18.338 20.601 23.153 15.048 23.281ZM20.911 15.422C20.562 15.248 18.903 14.433 18.582 14.315C18.261 14.196 18.027 14.138 17.792 14.487C17.558 14.836 16.91 15.592 16.705 15.828C16.5 16.063 16.294 16.093 15.946 15.919C15.598 15.745 14.523 15.418 13.251 14.283C12.257 13.397 11.593 12.3 11.388 11.952C11.182 11.603 11.368 11.413 11.544 11.238C11.704 11.081 11.9 10.827 12.077 10.621C12.254 10.415 12.311 10.267 12.429 10.033C12.548 9.798 12.489 9.593 12.4 9.419C12.311 9.244 11.65 7.585 11.357 6.887C11.073 6.212 10.783 6.303 10.567 6.292C10.362 6.282 10.128 6.28 9.893 6.28C9.659 6.28 9.279 6.369 8.958 6.718C8.637 7.066 7.764 7.882 7.764 9.541C7.764 11.2 8.987 12.8 9.163 13.034C9.34 13.269 11.59 16.718 15.003 18.161C15.842 18.511 16.496 18.719 17.004 18.875C17.85 19.136 18.619 19.097 19.225 19.006C19.902 18.904 21.261 18.189 21.554 17.372C21.847 16.554 21.847 15.855 21.758 15.709C21.669 15.564 21.435 15.48 21.086 15.305C20.737 15.13 20.911 15.422 20.911 15.422Z" fill="white" />
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 0C6.268 0 0 6.268 0 14C0 21.732 6.268 28 14 28C21.732 28 28 21.732 28 14C28 6.268 21.732 0 14 0ZM20.897 9.554C20.646 12.356 19.354 18.287 18.699 20.884C18.417 21.994 17.857 22.365 17.324 22.408C16.166 22.502 15.282 21.625 14.154 20.873C12.388 19.686 11.371 18.936 9.646 17.772C7.655 16.442 8.962 15.711 10.129 14.525C10.435 14.213 15.5 9.623 15.595 9.212C15.607 9.159 15.619 8.955 15.493 8.843C15.367 8.73 15.182 8.771 15.043 8.802C14.853 8.845 12.2 10.566 7.087 14.004C6.349 14.5 5.681 14.741 5.082 14.728C4.425 14.715 3.164 14.356 2.232 14.048C1.092 13.669 0.189 13.47 0.272 12.83C0.315 12.497 0.763 12.159 1.616 11.815C7.087 9.451 10.67 7.922 12.364 7.23C17.153 5.231 18.235 4.881 18.93 4.881C19.075 4.881 19.406 4.918 19.617 5.091C19.789 5.228 19.854 5.42 19.872 5.552C19.897 5.754 19.923 6.383 19.897 6.881C19.841 8.052 20.029 8.998 20.897 9.554Z" fill="white" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <h3 className="font-medium text-sm">
                                {selectedTemplate === 'whatsapp' ? 'WhatsApp Chat' : 'Telegram Chat'}
                            </h3>
                            <p className="text-xs opacity-80">Typically replies instantly</p>
                        </div>
                        <button
                            onClick={toggleWidget}
                            className="ml-auto text-white/80 hover:text-white transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Message area */}
                <div className="bg-gray-100 flex-1 p-4 flex flex-col space-y-2 overflow-y-auto">
                    <div className="bg-white p-3 rounded-lg shadow-sm self-start max-w-[80%] animate-fadeIn">
                        <p className="text-sm text-gray-800">
                            {selectedTemplate === 'whatsapp'
                                ? 'Greetings! And Welcome! How May We Assist You Today?'
                                : 'Hello! 👋 How can I help you today?'}
                        </p>
                    </div>
                </div>

                {/* Input area */}
                <div className="p-3 border-t border-gray-200 bg-white">
                    <button
                        className={`w-full py-2 px-4 rounded-full text-white font-medium text-sm transition-all duration-200 transform active:scale-95 ${selectedTemplate === 'whatsapp'
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                    >
                        {selectedTemplate === 'whatsapp' ? 'Start Chat' : 'Chat on Telegram'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default WidgetPreview