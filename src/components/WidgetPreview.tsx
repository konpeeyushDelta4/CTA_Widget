import { useState, useEffect, useRef } from 'react'
import { X, Send } from 'lucide-react'
import icons from '../utils/icons'

interface WidgetPreviewProps {
    selectedTemplate: string | null
}

export default function WidgetPreview({ selectedTemplate }: WidgetPreviewProps) {
    const [isWidgetOpen, setIsWidgetOpen] = useState(false)
    const [animating, setAnimating] = useState(false)
    const [displayedTemplate, setDisplayedTemplate] = useState<string | null>(selectedTemplate)
    const prevTemplateRef = useRef<string | null>(null)

    // Handle template change with animation
    useEffect(() => {
        if (selectedTemplate !== prevTemplateRef.current && selectedTemplate !== null) {
            // Only animate if we're switching from one template to another
            if (prevTemplateRef.current !== null) {
                setAnimating(true)
                // Wait for the exit animation
                setTimeout(() => {
                    setDisplayedTemplate(selectedTemplate)
                    // Small delay to ensure DOM updates before animating in
                    setTimeout(() => {
                        setAnimating(false)
                    }, 50)
                }, 300)
            } else {
                // Initial load, no animation needed
                setDisplayedTemplate(selectedTemplate)
            }
        }
        prevTemplateRef.current = selectedTemplate
    }, [selectedTemplate])

    if (!selectedTemplate) {
        return (
            <div className="flex items-center justify-center h-[450px] border-2 border-dashed border-border rounded-lg bg-muted">
                <p className="text-muted-foreground font-medium">Select a template to preview</p>
            </div>
        )
    }

    const isWhatsApp = displayedTemplate === 'whatsapp'

    // Telegram Widget
    function renderTelegramWidget() {
        return (
            <div className="w-full bg-card dark:bg-galaxyBg rounded-lg shadow-xl overflow-hidden max-h-[450px]">
                <div className="bg-blue-500 p-4 text-white">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <div dangerouslySetInnerHTML={{ __html: icons.telegram.icon }}
                            />
                        </div>
                        <div className="ml-3">
                            <p className="font-medium">Telegram</p>
                            <p className="text-xs opacity-80">Company Support</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 flex flex-col h-[350px] bg-white dark:bg-gray-800">
                    <div className="flex-1 overflow-y-auto hide-scrollbar space-y-3">
                        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 mb-3 max-w-[80%] border-l-4 border-blue-500 shadow-sm">
                            <p className="text-sm text-blue-800 dark:text-blue-200">Welcome to our support chat! How can we assist you today?</p>
                        </div>

                        <div className="flex justify-end mb-3">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 max-w-[80%] shadow-sm">
                                <p className="text-sm text-gray-800 dark:text-white">I need help with my recent order.</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 mb-3 max-w-[80%] border-l-4 border-blue-500 shadow-sm">
                            <p className="text-sm text-blue-800 dark:text-blue-200">I'd be happy to help! Could you please provide your order number?</p>
                        </div>
                    </div>

                    <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm placeholder:text-gray-400"
                            />
                            <button className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // WhatsApp Widget
    function renderWhatsAppWidget() {
        return (
            <div className="w-full bg-card dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden max-h-[450px]">
                <div className="bg-green-500 p-4 text-white">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <div dangerouslySetInnerHTML={{ __html: icons.whatsapp.icon }}
                            />
                        </div>
                        <div className="ml-3">
                            <p className="font-medium">John</p>
                            <p className="text-xs opacity-80">Online now</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 flex flex-col h-[350px]">
                    <div className="flex-1 overflow-y-auto hide-scrollbar space-y-3">
                        <div className="bg-muted dark:bg-gray-700 rounded-lg p-3 max-w-[80%] shadow-sm">
                            <p className="text-sm text-foreground dark:text-gray-200">Greetings! And Welcome To Company Name! How May We Assist You Today?</p>
                        </div>
                    </div>

                    <div className="mt-auto pt-3 border-t border-border dark:border-gray-700">
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1 border border-border dark:border-gray-700 bg-background dark:bg-gray-900 text-foreground dark:text-white rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 shadow-sm placeholder:text-muted-foreground"
                            />
                            <button className="bg-green-500 text-white px-4 rounded-r-lg hover:bg-green-600 transition-colors shadow-sm flex items-center justify-center">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Floating Widget Button
    const floatingWidget = (
        <div className="relative h-[500px] md:h-[94%] border rounded-lg bg-white dark:bg-galaxyBg flex items-center justify-center overflow-hidden shadow-inner">
            {/* Template container with animation classes */}
            <div className={`w-full h-full transition-all duration-300 ${animating ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}`}>
                {/* Floating widget button */}
                <div
                    className={`absolute bottom-6 right-6 z-10 ${isWidgetOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-all duration-300`}
                >
                    <button
                        onClick={() => setIsWidgetOpen(true)}
                        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white focus:outline-none transition-transform hover:scale-105 ${isWhatsApp
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                    >
                        {isWhatsApp ? (
                            <div dangerouslySetInnerHTML={{ __html: icons.whatsapp.icon }}
                            />
                        ) : (
                            <div dangerouslySetInnerHTML={{ __html: icons.telegram.icon }}
                            />
                        )}
                    </button>
                </div>

                {/* Full Widget that appears on click */}
                <div
                    className={`absolute inset-0 p-6 flex items-center justify-center transition-all duration-300 ${isWidgetOpen
                        ? 'opacity-100 z-20 scale-100'
                        : 'opacity-0 -z-10 scale-90'
                        }`}
                >
                    <div className="relative w-[320px] overflow-hidden">
                        {/* Close button with improved visibility */}
                        <div className="absolute top-7 right-7 z-50 translate-x-4 -translate-y-4 ">
                            <button
                                onClick={() => setIsWidgetOpen(false)}
                                className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-xl hover:bg-red-600 transition-colors shadow-red-500/20 hover:shadow-red-500/30"
                                aria-label="Close widget"
                            >
                                <X className="w-6 h-6 text-white" strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Widget content based on template */}
                        {isWhatsApp ? renderWhatsAppWidget() : renderTelegramWidget()}
                    </div>
                </div>
            </div>
        </div>
    )

    return floatingWidget
} 