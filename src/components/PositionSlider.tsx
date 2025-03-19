import { useState, useEffect } from 'react'

interface PositionSliderProps {
    position: { bottom: number; right: number }
    onChange: (position: { bottom: number; right: number }) => void
}

export default function PositionSlider({ position, onChange }: PositionSliderProps) {
    const [bottomValue, setBottomValue] = useState(position.bottom)
    const [rightValue, setRightValue] = useState(position.right)

    useEffect(() => {
        setBottomValue(position.bottom)
        setRightValue(position.right)
    }, [position])

    const handleBottomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value)
        setBottomValue(newValue)
        onChange({ ...position, bottom: newValue })
    }

    const handleRightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value)
        setRightValue(newValue)
        onChange({ ...position, right: newValue })
    }

    return (
        <div className="space-y-4">
            <div>
                <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="bottom-position" className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Bottom Position: {bottomValue}px
                    </label>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                        0-100
                    </span>
                </div>
                <input
                    id="bottom-position"
                    type="range"
                    min="0"
                    max="100"
                    value={bottomValue}
                    onChange={handleBottomChange}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="right-position" className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Right Position: {rightValue}px
                    </label>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                        0-100
                    </span>
                </div>
                <input
                    id="right-position"
                    type="range"
                    min="0"
                    max="100"
                    value={rightValue}
                    onChange={handleRightChange}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
            </div>
        </div>
    )
} 