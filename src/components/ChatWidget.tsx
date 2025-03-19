'use client'

import { useState, useRef, useEffect } from 'react'
import TemplateSelector from './TemplateSelector'
import WidgetPreview from './WidgetPreview'
import { Clipboard, Check, X, Copy, ChevronDown, ChevronUp } from 'lucide-react'
import { useCopy, useNumberInput } from '../hooks'
import { countryCodes } from '../utils/countryCode'

export default function ChatWidget() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [scriptVisible, setScriptVisible] = useState(false)
  const { copied, copyToClipboard } = useCopy()

  // Country code dropdown state
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
  const countryDropdownRef = useRef<HTMLDivElement>(null)
  const countrySearchInputRef = useRef<HTMLInputElement>(null)
  const [countrySearchTerm, setCountrySearchTerm] = useState('')

  // Filter countries based on search term
  const filteredCountries = countryCodes.filter(country =>
    country.name.toLowerCase().startsWith(countrySearchTerm.toLowerCase()) ||
    country.dial_code.includes(countrySearchTerm)
  )

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

    return `<!-- CTA Widget Integration -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'http://localhost:4173/widget.js?platform=${platform}&${config}';
    script.async = true;
    script.id = 'cta-chat-widget';
    document.body.appendChild(script);
  })();
</script>`;
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-foreground mb-12">
          Widget Generator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side: Template Options */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Choose a Template</h2>
            <TemplateSelector
              onSelect={setSelectedTemplate}
              selectedTemplate={selectedTemplate}
            />

            {selectedTemplate ? (
              <div className="mt-6 space-y-4">
                {/* Contact Information Section */}
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <h3 className="text-sm font-medium mb-2 text-card-foreground">Contact Information</h3>

                  {selectedTemplate === 'telegram' && (
                    <div className="mb-3">
                      <label htmlFor="telegramUsername" className="block text-xs mb-1 text-muted-foreground">
                        Telegram Username
                      </label>
                      <div className="flex">
                        <span className="bg-muted px-3 py-2 text-sm border border-r-0 border-border rounded-l-md">@</span>
                        <input
                          id="telegramUsername"
                          type="text"
                          value={telegramUsername}
                          onChange={(e) => setTelegramUsername(e.target.value)}
                          placeholder="username"
                          className="flex-1 border border-border rounded-r-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      {telegramUsername.trim().length === 0 && (
                        <p className="text-amber-500 dark:text-amber-400 text-xs mt-1">Required for script generation</p>
                      )}
                    </div>
                  )}

                  {selectedTemplate === 'whatsapp' && (
                    <div className="mb-3">
                      <label htmlFor="whatsappNumber" className="block text-xs mb-1 text-muted-foreground">
                        WhatsApp Number (10 digits)
                      </label>

                      <div className="flex w-full">
                        {/* Country code dropdown */}
                        <div className="relative" ref={countryDropdownRef}>
                          <button
                            type="button"
                            onClick={toggleCountryDropdown}
                            className="flex items-center px-3 py-2 text-sm bg-muted border border-r-0 border-border rounded-l-md hover:bg-muted/80 transition-colors"
                          >
                            <span className="mr-1 text-base">{selectedCountry.flag}</span>
                            <span className="mr-1">{selectedCountry.dial_code}</span>
                            {isCountryDropdownOpen ? (
                              <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>

                          {/* Dropdown menu */}
                          {isCountryDropdownOpen && (
                            <div className="absolute z-10 mt-1 max-h-60 w-64 overflow-auto rounded-md bg-card py-1 border border-border shadow-lg">
                              <div className="p-2 sticky top-0 bg-card border-b border-border">
                                <input
                                  type="text"
                                  placeholder="Search countries..."
                                  className="w-full px-2 py-1 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary"
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
                                      className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center ${selectedCountry.code === country.code ? 'bg-muted/70' : ''
                                        }`}
                                      onClick={() => {
                                        handleCountryChange(country);
                                        toggleCountryDropdown();
                                      }}
                                    >
                                      <span className="mr-2 text-base">{country.flag}</span>
                                      <span className="mr-2">{country.name}</span>
                                      <span className="text-muted-foreground">{country.dial_code}</span>
                                    </button>
                                  ))
                                ) : (
                                  <div className="px-3 py-4 text-sm text-center text-muted-foreground">
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
                          className={`flex-1 border ${whatsappError ? 'border-red-500' : 'border-border'} rounded-r-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary`}
                        />
                      </div>

                      {whatsappError && (
                        <p className="text-red-500 text-xs mt-1">{whatsappError}</p>
                      )}
                      {!whatsappError && whatsappRawValue.length === 0 && (
                        <p className="text-amber-500 dark:text-amber-400 text-xs mt-1">Required for script generation (10 digits)</p>
                      )}
                      {!whatsappError && whatsappRawValue.length > 0 && whatsappRawValue.length < 10 && (
                        <p className="text-amber-500 dark:text-amber-400 text-xs mt-1">{`${10 - whatsappRawValue.length} more digits needed`}</p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setScriptVisible(true)}
                  disabled={!isFormValid()}
                  className={`w-full font-medium py-3 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center ${isFormValid()
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                >
                  <Clipboard className="w-5 h-5 mr-2" />
                  Generate Integration Script
                </button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Select a template to generate the integration script
              </p>
            )}
          </div>

          {/* Right side: Widget Preview */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Widget Preview</h2>
            <WidgetPreview selectedTemplate={selectedTemplate} />
          </div>
        </div>
      </div>


      {/* Script Generation Modal */}
      {scriptVisible && selectedTemplate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in-50 slide-in-from-bottom-10 duration-300">
            <div className="p-5 border-b flex justify-between items-center bg-muted/30">
              <h3 className="text-xl font-bold text-card-foreground">Integration Script</h3>
              <button
                onClick={() => setScriptVisible(false)}
                className="bg-red-500/90 hover:bg-red-600 p-2 rounded-full transition-colors flex items-center justify-center transform hover:rotate-90 transition-transform duration-200"
              >
                <X className="w-5 h-5 text-white" strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-6 overflow-auto flex-grow">
              <div className="bg-muted/20 rounded-lg border border-border/60 p-4 mb-6">
                <p className="mb-4 text-card-foreground">
                  Copy and paste this script into your website's HTML code, preferably just before the closing <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">&lt;/body&gt;</code> tag:
                </p>
                <pre className="bg-[#0f172a] text-gray-100 p-5 rounded-lg overflow-x-auto text-sm max-h-80 whitespace-pre-wrap font-mono shadow-inner border border-slate-700">
                  {generateIntegrationScript()}
                </pre>
              </div>

              <div className="bg-muted/50 p-5 rounded-xl border border-border/60">
                <h4 className="font-semibold mb-3 text-foreground flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Important Notes
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4 ml-2">
                  <li className="pl-1">This script will load our widget from the server</li>
                  <li className="pl-1">The rest of the widget configuration is handled automatically</li>
                  <li className="pl-1">You only need to provide the platform and contact information</li>
                </ol>
                <p className="text-xs text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">The widget will automatically adapt to your website's design and color scheme. For advanced customization options, please contact our support team.</p>
              </div>
            </div>

            <div className="p-5 border-t bg-muted/30 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Ready to integrate with your website
              </span>
              <button
                onClick={() => copyToClipboard(generateIntegrationScript())}
                className="bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground px-5 py-2.5 rounded-lg flex items-center text-sm font-medium transition-colors"
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