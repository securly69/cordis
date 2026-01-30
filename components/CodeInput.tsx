'use client'

import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react'

interface CodeInputProps {
    length?: number
    onComplete: (code: string) => void
    error?: string
}

export default function CodeInput({ length = 6, onComplete, error }: CodeInputProps) {
    const [code, setCode] = useState<string[]>(Array(length).fill(''))
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (index: number, value: string) => {
        if (value && !/^\d$/.test(value)) return

        const newCode = [...code]
        newCode[index] = value
        setCode(newCode)

        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus()
        }

        if (newCode.every(digit => digit !== '') && newCode.join('').length === length) {
            onComplete(newCode.join(''))
        }
    }

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').slice(0, length)

        if (!/^\d+$/.test(pastedData)) return

        const newCode = [...code]
        pastedData.split('').forEach((char, i) => {
            if (i < length) newCode[i] = char
        })

        setCode(newCode)

        const nextIndex = Math.min(pastedData.length, length - 1)
        inputRefs.current[nextIndex]?.focus()

        if (newCode.every(digit => digit !== '')) {
            onComplete(newCode.join(''))
        }
    }

    const handleClick = (index: number) => {
        const firstEmptyIndex = code.findIndex(digit => digit === '')
        if (firstEmptyIndex !== -1 && firstEmptyIndex < index) {
            inputRefs.current[firstEmptyIndex]?.focus()
        }
    }

    return (
        <div className="space-y-2">
            <div className="flex gap-2 justify-center">
                {code.map((digit, index) => (
                    <input
                        key={index}
                        ref={el => {
                            inputRefs.current[index] = el
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleChange(index, e.target.value)}
                        onKeyDown={e => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        onClick={() => handleClick(index)}
                        className={`w-12 h-14 text-center text-2xl font-semibold bg-[#202225] border-b-2 ${error
                                ? 'border-[#f04747]'
                                : digit
                                    ? 'border-[#00aff4]'
                                    : 'border-[#4f545c]'
                            } text-white rounded focus:outline-none focus:border-[#00aff4] transition-colors`}
                    />
                ))}
            </div>
            {error && (
                <p className="text-[#f04747] text-sm text-center mt-2">{error}</p>
            )}
        </div>
    )
}
