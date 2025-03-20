import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import WidgetPreview from '../components/WidgetPreview'
import PositionSlider from '../components/PositionSlider'
import { Copy, Check } from 'lucide-react'
import { useWidgetScript } from '../hooks'
import { env } from '../utils/env'

interface TelegramTemplateData {
    variant: number
    platformSpecific: {
        name: string
        color: string
        hoverColor: string
        iconPath: string
    }
    dataFields: Array<{
        dataType: string
        label: string
        name: string
        placeholder: string
        defaultValue?: string
        required: boolean
    }>
    messages: {
        initial: string[]
        buttonText: string
    }
    validation: {
        username: {
            minLength: number
            maxLength: number
            allowedChars: string
        }
    }
}

function TelegramTemplate() {
    const navigate = useNavigate()
    const [template, setTemplate] = useState<TelegramTemplateData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [username, setUsername] = useState('')
    const [widgetPosition, setWidgetPosition] = useState({ bottom: 20, right: 20 })

    // Use the widget script hook
    const {
        scriptVisible,
        isCopied,
        scriptRef,
        handleCopyClick,
        showScript,
        hideScript,
        generateTelegramScript
    } = useWidgetScript()

    // Fetch template data
    useEffect(() => {
        async function fetchTemplateData() {
            try {
                setIsLoading(true)
                const response = await fetch(`${env.baseUrl}/config/templates/{telegram-template.json}`)
                // TODO: Dynamic URL slug
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch template: ${response.status}`)
                }
                
                const data = await response.json()
                setTemplate(data)
            } catch (err) {
                console.error('Error fetching template:', err)
                setError(err instanceof Error ? err.message : 'Failed to load template')
            } finally {
                setIsLoading(false)
            }
        }
        
        fetchTemplateData()
    }, [])

    if (isLoading) return <div className="text-center py-10">Loading template...</div>
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>
    if (!template) return <div className="text-center py-10 text-red-500">Template data not available</div>

    // Handle username validation
    const isUsernameValid = username.length >= template.validation.username.minLength &&
        username.length <= template.validation.username.maxLength &&
        new RegExp(`^[${template.validation.username.allowedChars}]*$`).test(username)

    return (
        <div>
            <div className="bg-white dark:bg-gray-800 p-4 shadow-md">
                <div className="container mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Templates
                    </button>
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Configure Telegram Template
                    </h1>
                    <div></div> {/* Empty div for flex spacing */}
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {scriptVisible ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-medium text-gray-800 dark:text-white">Your Telegram Widget Code</h2>
                            <button
                                onClick={hideScript}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Copy and paste this code into your website's HTML, preferably just before the closing <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">&lt;/body&gt;</code> tag.
                            </p>

                            <div className="relative">
                                <textarea
                                    ref={scriptRef}
                                    className="w-full h-64 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    readOnly
                                    value={generateTelegramScript(username, widgetPosition)}
                                />

                                <button
                                    onClick={handleCopyClick}
                                    className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors focus:outline-none"
                                    aria-label="Copy to clipboard"
                                >
                                    {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={hideScript}
                                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Edit Configuration
                            </button>
                            <button
                                onClick={handleCopyClick}
                                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
                            >
                                {isCopied ? (
                                    <>
                                        <Check className="w-5 h-5 mr-2" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-5 h-5 mr-2" />
                                        Copy Code
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left side: Configuration */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-medium mb-4 text-gray-800 dark:text-white">Telegram Settings</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="telegramUsername" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                            Telegram Username
                                        </label>
                                        <div className="flex">
                                            <span className="bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-md text-gray-500 dark:text-gray-400">
                                            </span>
                                            <input
                                                id="telegramUsername"
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                                                placeholder="username"
                                                className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-r-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        {username.length > 0 && !isUsernameValid && (
                                            <p className="text-amber-500 text-xs mt-1">
                                                Username must be {template.validation.username.minLength}-{template.validation.username.maxLength}
                                                characters and contain only letters, numbers, and underscores.
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Widget Position</h3>
                                        <PositionSlider position={widgetPosition} onChange={setWidgetPosition} />
                                    </div>
                                </div>
                            </div>

                            <button
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!isUsernameValid}
                                onClick={showScript}
                            >
                                Generate Widget Code
                            </button>
                        </div>

                        {/* Right side: Preview */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 h-full">
                            <h2 className="text-xl font-medium mb-4 text-gray-800 dark:text-white">Preview</h2>
                            <div className="aspect-video  bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                <WidgetPreview selectedTemplate="telegram" position={widgetPosition} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TelegramTemplate