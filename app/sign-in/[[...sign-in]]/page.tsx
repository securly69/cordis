'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import Image from 'next/image'
import Link from 'next/link'
import CodeInput from '@/components/CodeInput'

const getErrorMessage = (clerkError: string): string => {
    const errorMap: Record<string, string> = {
        'identifier_not_found': 'No account found with this email. Please check and try again.',
        'form_identifier_not_found': 'No account found with this email. Please check and try again.',
        'form_password_incorrect': 'Incorrect password. Please try again.',
        'form_code_incorrect': 'Invalid verification code. Please check and try again.',
        'verification_expired': 'This verification code has expired. Please request a new one.',
        'verification_failed': 'Verification failed. Please try again.',
        'too_many_attempts': 'Too many attempts. Please wait a moment before trying again.',
    }

    for (const [key, message] of Object.entries(errorMap)) {
        if (clerkError.toLowerCase().includes(key.toLowerCase())) return message
    }
    if (clerkError.toLowerCase().includes('password')) return 'Incorrect password. Please try again.'
    if (clerkError.toLowerCase().includes('identifier') || clerkError.toLowerCase().includes('email')) return 'Invalid email address. Please check and try again.'
    if (clerkError.toLowerCase().includes('code')) return 'Invalid verification code. Please try again.'

    return 'Something went wrong. Please try again.'
}

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#5865F2]">
            <div className="absolute inset-0 z-0">
                <Image src="/hero-bg.png" alt="Background" fill className="object-cover opacity-20" />
            </div>

            <div className="relative z-10 w-full max-w-[480px] p-8">
                <SignIn.Root>
                    <SignIn.Step name="start" className="bg-[#36393f] p-8 rounded-lg shadow-2xl">
                        <div className="text-center mb-6">
                            <h1 className="text-white text-2xl font-bold mb-2">Welcome back!</h1>
                            <p className="text-[#b9bbbe] text-sm">Log in to continue</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-center gap-4">
                                <Clerk.Connection name="discord" className="w-12 h-12 flex items-center justify-center rounded bg-[#2b2d31] hover:bg-[#40444b] hover:cursor-pointer transition-colors">
                                    <Clerk.Icon className="size-6" />
                                </Clerk.Connection>
                                <Clerk.Connection name="google" className="w-12 h-12 flex items-center justify-center rounded bg-[#2b2d31] hover:bg-[#40444b] hover:cursor-pointer transition-colors">
                                    <Clerk.Icon className="size-6" />
                                </Clerk.Connection>
                                <Clerk.Connection name="github" className="w-12 h-12 flex items-center justify-center rounded bg-[#2b2d31] hover:bg-[#40444b] hover:cursor-pointer transition-colors">
                                    <Clerk.Icon className="size-6" />
                                </Clerk.Connection>
                            </div>

                            <div className="flex items-center gap-3 text-[#72767d] text-xs">
                                <div className="flex-1 h-px bg-[#202225]" />
                                OR
                                <div className="flex-1 h-px bg-[#202225]" />
                            </div>

                            <Clerk.Field name="identifier" className="space-y-2">
                                <Clerk.Label className="block text-[#b9bbbe] uppercase text-xs font-bold">
                                    Email Address <span className="text-[#f04747]">*</span>
                                </Clerk.Label>
                                <Clerk.Input type="email" className="w-full bg-[#202225] border-none text-white px-3 py-2.5 rounded focus:outline-none focus:ring-1 focus:ring-[#00aff4]" />
                                <Clerk.FieldError className="block text-[#f04747] text-sm mt-1">
                                    {({ message }) => getErrorMessage(message || '')}
                                </Clerk.FieldError>
                            </Clerk.Field>

                            <SignIn.Action submit className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-2.5 rounded transition-colors">
                                Continue
                            </SignIn.Action>

                            <SignIn.Captcha />

                            <div className="text-sm text-[#72767d] text-center">
                                Need an account? <Link href="/sign-up" className="text-[#00aff4] hover:underline">Register</Link>
                            </div>
                        </div>
                    </SignIn.Step>

                    <SignIn.Step name="verifications" className="bg-[#36393f] p-8 rounded-lg shadow-2xl">
                        <SignIn.Strategy name="password">
                            <div className="text-center mb-6">
                                <h1 className="text-white text-2xl font-bold mb-2">Enter your password</h1>
                            </div>

                            <div className="space-y-4">
                                <Clerk.Field name="password" className="space-y-2">
                                    <Clerk.Label className="block text-[#b9bbbe] uppercase text-xs font-bold">
                                        Password <span className="text-[#f04747]">*</span>
                                    </Clerk.Label>
                                    <Clerk.Input type="password" className="w-full bg-[#202225] border-none text-white px-3 py-2.5 rounded focus:outline-none focus:ring-1 focus:ring-[#00aff4]" />
                                    <Clerk.FieldError className="block text-[#f04747] text-sm mt-1">
                                        {({ message }) => getErrorMessage(message || '')}
                                    </Clerk.FieldError>
                                </Clerk.Field>

                                <div className="text-sm">
                                    <SignIn.Action navigate="forgot-password" className="text-[#00aff4] hover:underline">
                                        Forgot your password?
                                    </SignIn.Action>
                                </div>

                                <SignIn.Action submit className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-2.5 rounded transition-colors">
                                    Log In
                                </SignIn.Action>

                                <div className="text-sm text-[#72767d] text-center">
                                    Need an account? <Link href="/sign-up" className="text-[#00aff4] hover:underline">Register</Link>
                                </div>
                            </div>
                        </SignIn.Strategy>

                        <SignIn.Strategy name="email_code">
                            <div className="text-center mb-6">
                                <h1 className="text-white text-2xl font-bold mb-2">Check your email</h1>
                                <p className="text-[#b9bbbe] text-sm">
                                    We sent a 6-digit code to <span className="text-white font-medium"><SignIn.SafeIdentifier /></span>
                                </p>
                            </div>

                            <Clerk.Field name="code">
                                {() => (
                                    <div className="space-y-4">
                                        <CodeInput onComplete={(code) => {
                                            const input = document.querySelector('input[name="code"]') as HTMLInputElement
                                            if (input) {
                                                input.value = code
                                                input.dispatchEvent(new Event('input', { bubbles: true }))
                                                setTimeout(() => {
                                                    const form = input.closest('form')
                                                    form?.requestSubmit()
                                                }, 100)
                                            }
                                        }} />
                                        <Clerk.Input type="text" name="code" className="hidden" />

                                        <SignIn.Action submit className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-2.5 rounded transition-colors">
                                            Verify
                                        </SignIn.Action>
                                    </div>
                                )}
                            </Clerk.Field>
                        </SignIn.Strategy>
                    </SignIn.Step>
                </SignIn.Root>
            </div>
        </div>
    )
}
