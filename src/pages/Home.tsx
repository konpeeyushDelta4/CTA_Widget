import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Template {
    id: string
    templateId: string
    slug: string
    name: string
    description: string
    image: string
    tags: string[]
    category: string
    isActive: boolean
}

// Hardcoded templates instead of fetching
const TEMPLATES: Template[] = [
    {
        id: "whatsapp-template1",
        templateId: "whatsapp-chat",
        slug: "whatsapp-chat",
        name: "WhatsApp Chat",
        description: "Direct messaging through WhatsApp with customizable appearance and behavior",
        image: "/assets/whatsapp-icon.svg",
        tags: ["whatsapp", "chat"],
        category: "whatsapp",
        isActive: true
    },
    {
        id: "telegram-template1",
        templateId: "telegram-chat",
        slug: "telegram-chat",
        name: "Telegram Chat",
        description: "Connect with customers using Telegram messaging with fully customizable widget",
        image: "/assets/telegram-icon.svg",
        tags: ["telegram", "messaging"],
        category: "telegram",
        isActive: true
    }
]

function Home() {
    const [templates] = useState<Template[]>(TEMPLATES)

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl via-purple-500  bg-gradient-to-r from-purple-500  bg-clip-text text-transparent font-bold text-center mb-10">Choose a Template</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <Link
                        to={`/${template.category}/${template.slug}`}
                        key={template.id}
                        className="block"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition transform hover:scale-105 hover:shadow-lg dark:border dark:border-gray-700">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={template.image}
                                    alt={template.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        console.error(`Failed to load image: ${template.image}`)
                                        const target = e.target as HTMLImageElement
                                        target.src = `/assets/fallback-template.png`
                                    }}
                                />
                            </div>

                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{template.slug}</h3>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">{template.description}</p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {template.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Home 