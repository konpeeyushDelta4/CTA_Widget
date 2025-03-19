import React, { useState } from 'react'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'

import icons from '../utils/icons'

const templates = [
    {
        id: 'telegram',
        name: 'Telegram Integration',
        description: 'Connect with customers via Telegram messaging',
        type: 'chat'
    },
    {
        id: 'whatsapp',
        name: 'WhatsApp Support',
        description: 'WhatsApp chat support integration',
        type: 'chat'
    }
]

interface TemplateSelectorProps {
    onSelect: (templateId: string) => void
    selectedTemplate: string | null
}

export default function TemplateSelector({ onSelect, selectedTemplate }: TemplateSelectorProps) {
    const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
    const activeTemplate = templates[activeTemplateIndex];

    const handlePrevTemplate = () => {
        setActiveTemplateIndex((prev) => (prev > 0 ? prev - 1 : templates.length - 1));
        onSelect(templates[activeTemplateIndex > 0 ? activeTemplateIndex - 1 : templates.length - 1].id);
    };

    const handleNextTemplate = () => {
        setActiveTemplateIndex((prev) => (prev < templates.length - 1 ? prev + 1 : 0));
        onSelect(templates[activeTemplateIndex < templates.length - 1 ? activeTemplateIndex + 1 : 0].id);
    };

    // Set default template if none selected
    React.useEffect(() => {
        if (!selectedTemplate && templates.length > 0) {
            onSelect(templates[0].id);
        }
    }, [selectedTemplate, onSelect]);

    // Render the active template
    const renderTemplate = () => {
        const isWhatsApp = activeTemplate.id === 'whatsapp';

        if (isWhatsApp) {
            return (
                <div
                    key={activeTemplate.id}
                    className="relative h-full border rounded-lg transition-all overflow-hidden shadow-lg border-primary"
                >
                    <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                        <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <div className="h-full flex flex-col">
                        <div className="p-6 bg-green-100 dark:bg-green-950/30 flex-1">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500 shadow-sm">
                                    <span className="text-white text-xs font-bold">J</span>
                                </div>
                                <div className="ml-3">
                                    <span className="text-lg font-medium block text-gray-800 dark:text-gray-200">John</span>
                                    <span className="text-xs text-muted-foreground">Online now</span>
                                </div>
                            </div>

                            <div className="text-sm text-foreground space-y-2 mb-5">
                                <p className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm inline-block dark:text-gray-200">Greetings! And Welcome To Company Name!</p>
                                <p className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm inline-block dark:text-gray-200">How May We Assist You Today?</p>
                            </div>

                            <div className="mt-auto">
                                <div className="text-center font-medium text-lg mb-3 text-gray-800 dark:text-gray-200">WhatsApp Integration</div>
                                <button className="w-full text-white py-3 px-4 rounded-lg flex items-center justify-center bg-green-500 shadow-sm hover:bg-green-600 transition-colors">
                                    <div
                                        className="w-5 h-5 mr-2"
                                        dangerouslySetInnerHTML={{ __html: icons.whatsapp.icon }}
                                    />
                                    <span>Start Chat with WhatsApp</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        // Telegram Template
        return (
            <div
                key={activeTemplate.id}
                className="relative h-full border rounded-lg transition-all overflow-hidden shadow-lg border-primary"
            >
                <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                    <Check className="w-3 h-3 text-primary-foreground" />
                </div>
                <div className="h-full flex flex-col">
                    <div className="p-6 bg-blue-50 dark:bg-blue-950/30 flex-1">
                        <div className="flex items-center justify-center mb-5">
                            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                                <div dangerouslySetInnerHTML={{ __html: icons.telegram.icon }}
                                />
                            </div>
                        </div>

                        <div className="text-center space-y-2 mb-8">
                            <p className="font-medium text-xl text-gray-800 dark:text-gray-200">Telegram Integration</p>
                            <p className="text-muted-foreground text-sm">Connect with Telegram</p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="w-full p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-sm shadow-sm">
                                <p className="text-blue-800 dark:text-blue-200">Get instant support via our Telegram channel</p>
                            </div>
                            <div className="w-full flex items-center gap-2 p-3 border border-border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                    <div dangerouslySetInnerHTML={{ __html: icons.telegram.icon }} />
                                </div>
                                <span className="text-foreground text-sm dark:text-gray-200">@username</span>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors flex items-center justify-center">
                                <div className='w-7 h-7 mr-4' dangerouslySetInnerHTML={{ __html: icons.telegram.icon }}
                                />
                                Connect with Telegram
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="relative h-[450px] md:h-[500px]">
            {/* Template display */}
            <div className="h-full">
                {renderTemplate()}
            </div>

            {/* Navigation arrows */}
            <button
                onClick={handlePrevTemplate}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-card border border-border rounded-full p-2 shadow-lg hover:bg-muted transition-colors z-10"
                aria-label="Previous template"
            >
                <ChevronLeft className="h-6 w-6 text-muted-foreground" />
            </button>
            <button
                onClick={handleNextTemplate}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-card border border-border rounded-full p-2 shadow-lg hover:bg-muted transition-colors z-10"
                aria-label="Next template"
            >
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </button>

            {/* Pagination indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {templates.map((template, index) => (
                    <div
                        key={template.id}
                        className={`h-2 w-2 rounded-full transition-colors ${index === activeTemplateIndex ? 'bg-primary' : 'bg-muted'
                            }`}
                    />
                ))}
            </div>
        </div>
    )
} 