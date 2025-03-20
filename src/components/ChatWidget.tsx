import { useState, useEffect } from 'react'
import TemplateSelector from './TemplateSelector'
import WidgetPreview from './WidgetPreview'
import PositionSlider from './PositionSlider'

interface ChatWidgetProps {
  selectedTemplate?: string | null
}

export default function ChatWidget({ selectedTemplate: initialTemplate }: ChatWidgetProps = {}) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(initialTemplate || null)
  const [widgetPosition, setWidgetPosition] = useState({ bottom: 20, right: 20 })

  // Update internal state if prop changes
  useEffect(() => {
    if (initialTemplate && initialTemplate !== selectedTemplate) {
      setSelectedTemplate(initialTemplate)
    }
  }, [initialTemplate, selectedTemplate])

  return (
    <div className="w-full">
      <TemplateSelector
        onSelect={setSelectedTemplate}
        selectedTemplate={selectedTemplate}
      />

      <div className="mt-6">
        <WidgetPreview
          selectedTemplate={selectedTemplate}
          position={widgetPosition}
        />
      </div>

      <div className="mt-6">
        <PositionSlider
          position={widgetPosition}
          onChange={setWidgetPosition}
        />
      </div>
    </div>
  )
}