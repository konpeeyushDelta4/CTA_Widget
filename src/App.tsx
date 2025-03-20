import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WhatsAppTemplate from "./pages/WhatsAppTemplate";
import TelegramTemplate from "./pages/TelegramTemplate";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5F7] to-[#ECECF0] dark:from-[#1A1A1A] dark:to-[#121212]">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Header area with Apple-inspired branding */}
        <header className="py-8 md:py-10">
          <div className="flex justify-center md:justify-start">
            <div className="inline-flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="text-2xl font-medium text-gray-800 dark:text-white tracking-tight">Widget Generator</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="pb-20 pt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/whatsapp/:slug" element={<WhatsAppTemplate />} />
            <Route path="/telegram/:slug" element={<TelegramTemplate />} />
            {/* Default fallback to the home page */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        {/* Footer area */}
        <footer className="border-t border-gray-200/60 dark:border-gray-800/60 mt-12 py-8 text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Widget Generator © {new Date().getFullYear()}</p>
          <p className="mt-2 text-sm text-gray-500/90 dark:text-gray-500/90">Seamlessly integrate communication widgets into your website</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
