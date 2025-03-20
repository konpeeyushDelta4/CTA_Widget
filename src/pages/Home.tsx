import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { env } from '../utils/env'

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

interface TemplatesResponse {
    version: number
    templates: Template[]
}

function Home() {
    const [templates, setTemplates] = useState<Template[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchTemplates() {
            try {
                setIsLoading(true)
                const response = await fetch(`${env.baseUrl}/config/templates/allTemplates.json`)

                if (!response.ok) {
                    throw new Error(`Failed to fetch templates: ${response.status}`)
                }

                const data = await response.json() as TemplatesResponse
                setTemplates(data.templates)
            } catch (err) {
                console.error('Error fetching templates:', err)
                setError(err instanceof Error ? err.message : 'Failed to load templates')
            } finally {
                setIsLoading(false)
            }
        }

        fetchTemplates()
    }, [])

    if (isLoading) return <div className="text-center py-10">Loading templates...</div>
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-500 bg-clip-text text-transparent">Choose a Template</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.map((template) => (
                    <Link
                        to={`/${template.category}/${template.slug}`}
                        key={template.id}
                        className="block"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transition transform hover:scale-105 hover:shadow-lg dark:border dark:border-gray-700">
                            <div className="h-48 overflow-hidden relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                                <img
                                    src={template.image}
                                    alt={template.name}
                                    className="w-24 h-24 object-contain"
                                    onError={(e) => {
                                        console.error(`Failed to load image: ${template.image}`)
                                        const target = e.target as HTMLImageElement
                                        target.src = `/assets/fallback-template.png`
                                    }}
                                />
                            </div>

                            <div className="p-5">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{template.name}</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">{template.description}</p>

                                <div className="mt-2 flex flex-wrap gap-2">
                                    {template.tags.map((tag: string) => (
                                        <span
                                            key={tag}
                                            className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium"
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