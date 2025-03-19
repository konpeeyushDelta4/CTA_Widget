'use client'

import { useState, useRef, useEffect } from 'react'
import TemplateSelector from './TemplateSelector'
import WidgetPreview from './WidgetPreview'
import PositionSlider from './PositionSlider'
import { Clipboard, Check, X, Copy, ChevronDown, ChevronUp } from 'lucide-react'
import { useCopy, useNumberInput } from '../hooks'
import { countryCodes } from '../utils/countryCode'
import { env } from '../utils/env'

export default function ChatWidget() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [scriptVisible, setScriptVisible] = useState(false)
  const { copied, copyToClipboard } = useCopy()
  const [widgetPosition, setWidgetPosition] = useState({ bottom: 20, right: 20 })

  // Country code dropdown state
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
  const countryDropdownRef = useRef<HTMLDivElement>(null)
  const countrySearchInputRef = useRef<HTMLInputElement>(null)
  const [countrySearchTerm, setCountrySearchTerm] = useState('')

  // Contact information for widget integration
  const [telegramUsername, setTelegramUsername] = useState<string>('')
  const {
    value: whatsappNumber,
    rawValue: whatsappRawValue,
    handleChange: handleWhatsappNumberChange,
    error: whatsappError,
    getFormattedNumber,
    isValid: isWhatsappNumberValid,
    selectedCountry,
    handleCountryChange
  } = useNumberInput()

  // Filter countries based on search term
  const filteredCountries = countryCodes.filter(country =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
    country.dial_code.includes(countrySearchTerm)
  )

  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false)
        setCountrySearchTerm('') // Clear search when closing dropdown
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle dropdown toggle
  const toggleCountryDropdown = () => {
    const newState = !isCountryDropdownOpen
    setIsCountryDropdownOpen(newState)
    if (!newState) {
      setCountrySearchTerm('') // Clear search when closing dropdown
    } else {
      // Focus the search input when opening the dropdown
      setTimeout(() => {
        countrySearchInputRef.current?.focus()
      }, 0)
    }
  }

  // Check if the form is valid based on selected template
  const isFormValid = () => {
    if (selectedTemplate === 'telegram') {
      return telegramUsername.trim().length > 0;
    } else if (selectedTemplate === 'whatsapp') {
      return isWhatsappNumberValid;
    }
    return false;
  }

  const generateIntegrationScript = () => {
    if (!selectedTemplate) return '';

    const platform = selectedTemplate;
    let config = '';

    if (selectedTemplate === 'telegram') {
      config = `username=${telegramUsername}`;
    } else if (selectedTemplate === 'whatsapp') {
      config = `phone=${getFormattedNumber()}`;
    }

    // Add position parameters
    const positionConfig = `&bottom=${widgetPosition.bottom}&right=${widgetPosition.right}`;

    return `<!-- CTA Widget Integration -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${env.baseUrl}/widget.js?platform=${platform}&${config}${positionConfig}';
    script.async = true;
    script.id = 'cta-chat-widget';
    document.body.appendChild(script);
  })();
</script>`;
  };

  return (
    <main className="mx-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-medium text-center text-gray-800 dark:text-white mb-14 tracking-tight">
          Create Your <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Communication Widget</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left side: Template Options */}
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] p-6 lg:p-8">
            <h2 className="text-2xl font-medium mb-6 text-gray-800 dark:text-gray-100">Choose a Template</h2>
            <TemplateSelector
              onSelect={setSelectedTemplate}
              selectedTemplate={selectedTemplate}
            />

            {selectedTemplate ? (
              <div className="mt-8 space-y-6">
                {/* Position Slider - Placed above Contact Information */}
                <div className="p-5 bg-gray-50/80 dark:bg-gray-800/50 rounded-xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm">
                  <h3 className="text-sm font-semibold mb-4 text-gray-800 dark:text-gray-100">Widget Position</h3>
                  <PositionSlider position={widgetPosition} onChange={setWidgetPosition} />
                </div>

                {/* Contact Information Section */}
                <div className="p-5 bg-gray-50/80 dark:bg-gray-800/50 rounded-xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm">
                  <h3 className="text-sm font-semibold mb-3 text-gray-800 dark:text-gray-100">Contact Information</h3>

                  {selectedTemplate === 'telegram' && (
                    <div className="mb-3">
                      <label htmlFor="telegramUsername" className="block text-xs mb-1.5 text-gray-500 dark:text-gray-400 font-medium">
                        Telegram Username
                      </label>
                      <div className="flex">
                        <span className="bg-gray-100 dark:bg-gray-800 px-3 py-2.5 text-sm border border-r-0 border-gray-200/80 dark:border-gray-700/80 rounded-l-lg text-gray-500 dark:text-gray-400">@</span>
                        <input
                          id="telegramUsername"
                          type="text"
                          value={telegramUsername}
                          onChange={(e) => setTelegramUsername(e.target.value)}
                          placeholder="username"
                          className="flex-1 border border-gray-200/80 dark:border-gray-700/80 rounded-r-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-gray-100"
                        />
                      </div>
                      {telegramUsername.trim().length === 0 && (
                        <p className="text-amber-500 dark:text-amber-400 text-xs mt-1.5 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Required for script generation
                        </p>
                      )}
                    </div>
                  )}

                  {selectedTemplate === 'whatsapp' && (
                    <div className="mb-3">
                      <label htmlFor="whatsappNumber" className="block text-xs mb-1.5 text-gray-500 dark:text-gray-400 font-medium">
                        WhatsApp Number (10 digits)
                      </label>

                      <div className="flex w-full">
                        {/* Country code dropdown */}
                        <div className="relative" ref={countryDropdownRef}>
                          <button
                            type="button"
                            onClick={toggleCountryDropdown}
                            className="flex items-center px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-r-0 border-gray-200/80 dark:border-gray-700/80 rounded-l-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <span className="mr-1 text-base">{selectedCountry?.flag || "🌍"}</span>
                            <span className="mr-1 text-gray-800 dark:text-gray-200">{selectedCountry?.dial_code || "+1"}</span>
                            {isCountryDropdownOpen ? (
                              <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            )}
                          </button>

                          {/* Dropdown menu */}
                          {isCountryDropdownOpen && (
                            <div className="absolute z-10 mt-1 max-h-60 w-64 overflow-auto rounded-xl bg-white dark:bg-gray-800 py-2 border border-gray-200/80 dark:border-gray-700/80 shadow-lg shadow-gray-200/80 dark:shadow-black/30">
                              <div className="p-2 sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700/80">
                                <input
                                  type="text"
                                  placeholder="Search countries..."
                                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200/80 dark:border-gray-700/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-gray-100"
                                  onClick={(e) => e.stopPropagation()}
                                  value={countrySearchTerm}
                                  onChange={(e) => setCountrySearchTerm(e.target.value)}
                                  ref={countrySearchInputRef}
                                />
                              </div>
                              <div className="pt-1">
                                {filteredCountries.length > 0 ? (
                                  filteredCountries.map((country) => (
                                    <button
                                      key={country.code}
                                      className={`w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedCountry?.code === country.code ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                      onClick={() => {
                                        handleCountryChange(country);
                                        toggleCountryDropdown();
                                      }}
                                    >
                                      <span className="mr-2 text-base">{country.flag}</span>
                                      <span className="mr-2 text-gray-800 dark:text-gray-200">{country.name}</span>
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
                        <input
                          id="whatsappNumber"
                          type="text"
                          value={whatsappNumber}
                          onChange={handleWhatsappNumberChange}
                          placeholder="XXX-XXX-XXXX"
                          className={`flex-1 border ${whatsappError ? 'border-red-500' : 'border-gray-200/80 dark:border-gray-700/80'} rounded-r-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-gray-100`}
                        />
                      </div>

                      {whatsappError && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {whatsappError}
                        </p>
                      )}
                      {!whatsappError && whatsappRawValue.length === 0 && (
                        <p className="text-amber-500 dark:text-amber-400 text-xs mt-1.5 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Required for script generation (10 digits)
                        </p>
                      )}
                      {!whatsappError && whatsappRawValue.length > 0 && whatsappRawValue.length < 10 && (
                        <p className="text-amber-500 dark:text-amber-400 text-xs mt-1.5 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {`${10 - whatsappRawValue.length} more digits needed`}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setScriptVisible(true)}
                  disabled={!isFormValid()}
                  className={`w-full font-medium py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center ${isFormValid()
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/20 hover:shadow-blue-500/30 hover:translate-y-[-1px]'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }`}
                >
                  <Clipboard className="w-5 h-5 mr-2" />
                  Generate Integration Script
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                Select a template to generate the integration script
              </p>
            )}
          </div>

          {/* Right side: Widget Preview */}
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] p-6 lg:p-8">
            <h2 className="text-2xl font-medium mb-6 text-gray-800 dark:text-gray-100">Widget Preview</h2>
            <WidgetPreview selectedTemplate={selectedTemplate} position={widgetPosition} />
          </div>
        </div>
      </div>

      {/* Script Generation Modal - Apple-inspired frosted glass effect */}
      {scriptVisible && selectedTemplate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 dark:bg-[#1C1C1E]/95 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200/60 dark:border-gray-800/60 flex justify-between items-center">
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100">Integration Script</h3>
              <button
                onClick={() => setScriptVisible(false)}
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full transition-all flex items-center justify-center transform hover:rotate-90 duration-200 focus:outline-none"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" strokeWidth={2} />
              </button>
            </div>

            <div className="p-6 overflow-auto flex-grow">
              <div className="bg-gray-50/80 dark:bg-gray-800/50 rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-5 mb-6 shadow-sm">
                <p className="mb-4 text-gray-800 dark:text-gray-100">
                  Copy and paste this script into your website's HTML code, preferably just before the closing <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-md text-sm font-mono text-blue-600 dark:text-blue-400">&lt;/body&gt;</code> tag:
                </p>
                <pre className="bg-[#0A0F1B] text-gray-100 p-5 rounded-xl overflow-x-auto text-sm max-h-80 whitespace-pre-wrap font-mono shadow-inner border border-gray-800/80">
                  {generateIntegrationScript()}
                </pre>
              </div>

              <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100/60 dark:border-blue-800/40 shadow-sm">
                <h4 className="font-medium mb-4 text-gray-800 dark:text-white flex items-center text-base">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Important Notes
                </h4>
                <ol className="list-decimal list-inside space-y-2.5 text-sm text-gray-600 dark:text-gray-300 mb-4 ml-2">
                  <li className="pl-1">This script will load our widget from the server</li>
                  <li className="pl-1">The rest of the widget configuration is handled automatically</li>
                  <li className="pl-1">You only need to provide the platform and contact information</li>
                </ol>
                <p className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50/80 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-100/80 dark:border-blue-800/40">The widget will automatically adapt to your website's design and color scheme. For advanced customization options, please contact our support team.</p>
              </div>
            </div>

            <div className="p-5 border-t border-gray-200/60 dark:border-gray-800/60 bg-gray-50/80 dark:bg-gray-800/30 flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Ready to integrate with your website
              </span>
              <button
                onClick={() => copyToClipboard(generateIntegrationScript())}
                className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center text-sm font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:translate-y-[-1px]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" /> Copy Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}