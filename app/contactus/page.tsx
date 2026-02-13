'use client'

import { redirect } from 'next/navigation'
import { useState } from 'react'

export default function ContactModal() {
    const [open, setOpen] = useState(true)
    const [copied, setCopied] = useState(false)

    if (!open) return null

    const email = 'get-help@contactcordis.anonaddy.com'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-xl bg-[#313338] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_25px_80px_rgba(0,0,0,0.7)]">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-[#1f2023]">
                    <div className="h-9 w-9 rounded-full bg-[#5865F2] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                            <path d="M4 4h16v16H4z" />
                            <path d="M22 6l-10 7L2 6" />
                        </svg>
                    </div>
                    <h1 className="text-white font-semibold text-lg">
                        Contact Cordis
                    </h1>
                </div>

                <div className="px-6 py-5 space-y-4">
                    <p className="text-[#b5bac1] text-sm leading-relaxed">
                        For support, questions, or account issues, contact us directly by email.
                    </p>

                    <button
                        onClick={async () => {
                            await navigator.clipboard.writeText(email)
                            setCopied(true)
                            setTimeout(() => setCopied(false), 2000)
                        }}
                        className="w-full flex items-center justify-between gap-3 rounded-md bg-[#1e1f22] border border-[#26272b] px-4 py-3 hover:border-[#5865F2] hover:bg-[#202225] transition group"
                    >
                        <span className="text-white text-sm font-medium break-all">
                            {email}
                        </span>

                        <span className={`hover:cursor-pointer text-xs font-medium transition ${copied ? 'text-[#3ba55c]' : 'text-[#5865F2]'}`}>
                            {copied ? 'Copied' : 'Copy'}
                        </span>
                    </button>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#1f2023]">
                    <button
                        onClick={() => redirect('/dashboard')}
                        className="hover:cursor-pointer rounded-md bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-medium px-5 py-2 transition"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    )
}
