import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import WidgetPreview from '../components/WidgetPreview'
import PositionSlider from '../components/PositionSlider'
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import { countryCodes } from '../utils/countryCode'
import { useWidgetScript } from '../hooks'

interface WhatsAppTemplateData {
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
        phone: {
            minLength: number
            maxLength: number
            allowedChars: string
        }
    }
}

interface Country {
    name: string
    dial_code: string
    code: string
    flag: string
}

function WhatsAppTemplate() {
    const navigate = useNavigate()
    const [template, setTemplate] = useState<WhatsAppTemplateData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [widgetPosition, setWidgetPosition] = useState({ bottom: 20, right: 20 })

    // Use the widget script hook
    const {
        scriptVisible,
        isCopied,
        scriptRef,
        handleCopyClick,
        showScript,
        hideScript,
        generateWhatsAppScript
    } = useWidgetScript()

    // Fetch template data
    useEffect(() => {
        async function fetchTemplateData() {
            try {
                setIsLoading(true)
                const response = await fetch('http://localhost:4173/config/templates/whatsapp/whatsapp-template.json')
                
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

    // Country code dropdown state
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
    const countryDropdownRef = useRef<HTMLDivElement>(null)
    const [selectedCountry, setSelectedCountry] = useState<Country>(countryCodes[0])
    const [countrySearchTerm, setCountrySearchTerm] = useState('')

    // Filter countries based on search term
    const filteredCountries = countryCodes.filter(country =>
        country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
        country.dial_code.includes(countrySearchTerm)
    )

    // Handle dropdown toggle
    const toggleCountryDropdown = () => {
        setIsCountryDropdownOpen(!isCountryDropdownOpen)
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
                setIsCountryDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    if (isLoading) return <div className="text-center py-10">Loading template...</div>
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>
    if (!template) return <div className="text-center py-10 text-red-500">Template data not available</div>

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
                        Configure WhatsApp Template
                    </h1>
                    <div></div> {/* Empty div for flex spacing */}
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {scriptVisible ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-medium text-gray-800 dark:text-white">Your WhatsApp Widget Code</h2>
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
                                    className="w-full h-64 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    readOnly
                                    value={generateWhatsAppScript(phoneNumber, selectedCountry.dial_code, widgetPosition)}
                                />

                                <button
                                    onClick={handleCopyClick}
                                    className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors focus:outline-none"
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
                                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center"
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
                                <h2 className="text-xl font-medium mb-4 text-gray-800 dark:text-white">WhatsApp Settings</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="whatsappNumber" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                            Phone Number
                                        </label>
                                        <div className="flex">
                                            {/* Country code dropdown */}
                                            <div className="relative" ref={countryDropdownRef}>
                                                <button
                                                    type="button"
                                                    onClick={toggleCountryDropdown}
                                                    className="flex items-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                >
                                                    <span className="mr-1">{selectedCountry.flag}</span>
                                                    <span className="mr-1">{selectedCountry.dial_code}</span>
                                                    {isCountryDropdownOpen ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </button>

                                                {/* Dropdown menu */}
                                                {isCountryDropdownOpen && (
                                                    <div className="absolute z-10 mt-1 max-h-60 w-64 overflow-auto rounded-lg bg-white dark:bg-gray-800 py-2 border border-gray-300 dark:border-gray-600 shadow-lg">
                                                        <div className="p-2 sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                                            <input
                                                                type="text"
                                                                placeholder="Search countries..."
                                                                className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                                                                onClick={(e) => e.stopPropagation()}
                                                                value={countrySearchTerm}
                                                                onChange={(e) => setCountrySearchTerm(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="pt-1">
                                                            {filteredCountries.length > 0 ? (
                                                                filteredCountries.map((country) => (
                                                                    <button
                                                                        key={country.code}
                                                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${selectedCountry.code === country.code ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                                                        onClick={() => {
                                                                            setSelectedCountry(country);
                                                                            setIsCountryDropdownOpen(false);
                                                                        }}
                                                                    >
                                                                        <span className="mr-2">{country.flag}</span>
                                                                        <span className="mr-2 text-gray-800 dark:text-white">{country.name}</span>
                                                                        <span className="text-gray-500 dark:text-gray-400">{country.dial_code}</span>
                                                                    </button>
                                                                ))
                                                            ) : (
                                                                <div className="px-3 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                                                                    No countries found matching "{countrySearchTerm}"
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Phone number input */}
                                            <div className="relative flex-1">
                                                <input
                                                    id="whatsappNumber"
                                                    type="text"
                                                    value={phoneNumber}
                                                    onChange={(e) => {
                                                        const input = e.target.value.replace(/\D/g, "")
                                                        if (input.length <= 10) {
                                                            setPhoneNumber(input)
                                                        }
                                                    }}
                                                    placeholder="Phone number"
                                                    maxLength={10}
                                                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-r-md px-3 py-2 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    aria-describedby="phone-digits-counter"
                                                />
                                                <div 
                                                    id="phone-digits-counter" 
                                                    className={`absolute right-3 top-2 text-xs ${
                                                        phoneNumber.length === 10 
                                                            ? 'text-green-500' 
                                                            : phoneNumber.length >= 7 
                                                                ? 'text-amber-500' 
                                                                : 'text-gray-400'
                                                    }`}
                                                >
                                                    {phoneNumber.length}/10
                                                </div>
                                            </div>
                                        </div>
                                        {phoneNumber.length > 0 && phoneNumber.length < template.validation.phone.minLength && (
                                            <p className="text-amber-500 text-xs mt-1">
                                                Please enter a complete {template.validation.phone.minLength}-digit phone number
                                            </p>
                                        )}
                                        {phoneNumber.length === 10 && (
                                            <p className="text-green-500 text-xs mt-1">
                                                Valid phone number ✓
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
                                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={phoneNumber.length < template.validation.phone.minLength}
                                onClick={showScript}
                            >
                                Generate Widget Code
                            </button>
                        </div>

                        {/* Right side: Preview */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 h-full">
                            <h2 className="text-xl font-medium mb-4 text-gray-800 dark:text-white">Preview</h2>
                            <div className="aspect-video  bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                <WidgetPreview selectedTemplate="whatsapp" position={widgetPosition} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WhatsAppTemplate 