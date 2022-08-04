import React, { useEffect, useState } from 'react'
import {FaMinus, FaPlus} from 'react-icons/fa'

export default function InputStepNumber({onChange, min = 0, max, disabled}) {

    const [count, setCount] = useState(min)

    useEffect(() => {
        onChange(count)
    }, [count, onChange])

    const clamp = (value) => {
        if (min !== undefined && min !== null && value < min) return min
        if (max !== undefined && max !== null && value > max) return max
        return value
    }

    const handleIncrement = () => {
        let nextValue = clamp(count + 1)
        setCount(nextValue)
        onChange(nextValue)
    }

    const handleDecrement = () => {
        let nexValue = clamp(count - 1)
        setCount(nexValue)
        onChange(nexValue)
    }

    return (
        <div className={`input-step-number ${disabled ? 'disabled': ''}`}>
            <button onClick={handleDecrement}>
                <FaMinus />
            </button>
            <input type="text" disabled={true} value={count} onChange={onChange} />
            <button onClick={handleIncrement}>
                <FaPlus />
            </button>
        </div>
    )
}