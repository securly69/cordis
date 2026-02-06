'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignUp from '@clerk/elements/sign-up'
import Image from 'next/image'
import Link from 'next/link'
import CodeInput from '@/components/CodeInput'

const getErrorMessage = (clerkError: string): string => {
    const errorMap: Record<string, string> = {
        'form_identifier_exists': 'An account with this email already exists. Please sign in instead.',
        'form_password_pwned': 'This password has been found in a data breach. Please choose a more secure password.',
        'form_password_length_too_short': 'Password must be at least 8 characters long.',
        'form_password_no_uppercase': 'Password must contain at least one uppercase letter.',
        'form_password_no_lowercase': 'Password must contain at least one lowercase letter.',
        'form_password_no_number': 'Password must contain at least one number.',
        'form_username_exists': 'This username is already taken. Please choose another.',
        'form_code_incorrect': 'Invalid verification code. Please check and try again.',
        'verification_expired': 'This verification code has expired. Please request a new one.',
        'verification_failed': 'Verification failed. Please try again.',
    }

    for (const [key, message] of Object.entries(errorMap)) {
        if (clerkError.toLowerCase().includes(key.toLowerCase())) {
            return message
        }
    }

    if (clerkError.toLowerCase().includes('password')) return 'Please choose a stronger password.'
    if (clerkError.toLowerCase().includes('email')) return 'Please enter a valid email address.'
    if (clerkError.toLowerCase().includes('username')) return 'Please choose a different username.'
    if (clerkError.toLowerCase().includes('code')) return 'Invalid verification code. Please try again.'

    return 'Something went wrong. Please try again.'
}

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#5865F2]">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-bg.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-20"
                />
            </div>

            <div className="relative z-10 w-full max-w-[480px] p-8">
                <SignUp.Root>
                    <SignUp.Step
                        name="start"
                        className="bg-[#36393f] p-8 rounded-lg shadow-2xl"
                    >
                        <div className="text-center mb-6">
                            <h1 className="text-white text-2xl font-bold mb-2">Create an account</h1>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-center gap-4">
                                <Clerk.Connection
                                    name="discord"
                                    className="w-12 h-12 flex items-center justify-center rounded bg-[#2b2d31] hover:bg-[#40444b] hover:cursor-pointer transition-colors"
                                >
                                    <Clerk.Icon className="size-6" />
                                </Clerk.Connection>

                                <Clerk.Connection
                                    name="google"
                                    className="w-12 h-12 flex items-center justify-center rounded bg-[#2b2d31] hover:bg-[#40444b] hover:cursor-pointer transition-colors"
                                >
                                    <Clerk.Icon className="size-6" />
                                </Clerk.Connection>

                                <Clerk.Connection
                                    name="github"
                                    className="w-12 h-12 flex items-center justify-center rounded bg-[#2b2d31] hover:bg-[#40444b] hover:cursor-pointer transition-colors"
                                >
                                    <Clerk.Icon className="size-6" />
                                </Clerk.Connection>
                            </div>

                            <div className="flex items-center gap-3 text-[#72767d] text-xs">
                                <div className="flex-1 h-px bg-[#202225]" />
                                OR
                                <div className="flex-1 h-px bg-[#202225]" />
                            </div>

                            <Clerk.Field name="emailAddress" className="space-y-2">
                                <Clerk.Label className="block text-[#b9bbbe] uppercase text-xs font-bold">
                                    Email <span className="text-[#f04747]">*</span>
                                </Clerk.Label>
                                <Clerk.Input
                                    type="email"
                                    className="w-full bg-[#202225] border-none text-white px-3 py-2.5 rounded focus:outline-none focus:ring-1 focus:ring-[#00aff4]"
                                />
                                <Clerk.FieldError className="block text-[#f04747] text-sm mt-1">
                                    {({ message }) => getErrorMessage(message || '')}
                                </Clerk.FieldError>
                            </Clerk.Field>

                            <Clerk.Field name="username" className="space-y-2">
                                <Clerk.Label className="block text-[#b9bbbe] uppercase text-xs font-bold">
                                    Username <span className="text-[#f04747]">*</span>
                                </Clerk.Label>
                                <Clerk.Input
                                    type="text"
                                    className="w-full bg-[#202225] border-none text-white px-3 py-2.5 rounded focus:outline-none focus:ring-1 focus:ring-[#00aff4]"
                                />
                                <Clerk.FieldError className="block text-[#f04747] text-sm mt-1">
                                    {({ message }) => getErrorMessage(message || '')}
                                </Clerk.FieldError>
                            </Clerk.Field>

                            <Clerk.Field name="password" className="space-y-2">
                                <Clerk.Label className="block text-[#b9bbbe] uppercase text-xs font-bold">
                                    Password <span className="text-[#f04747]">*</span>
                                </Clerk.Label>
                                <Clerk.Input
                                    type="password"
                                    className="w-full bg-[#202225] border-none text-white px-3 py-2.5 rounded focus:outline-none focus:ring-1 focus:ring-[#00aff4]"
                                />
                                <Clerk.FieldError className="block text-[#f04747] text-sm mt-1">
                                    {({ message }) => getErrorMessage(message || '')}
                                </Clerk.FieldError>
                            </Clerk.Field>

                            <SignUp.Captcha className="flex justify-center" />

                            <SignUp.Action
                                submit
                                className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-2.5 rounded transition-colors"
                            >
                                Continue
                            </SignUp.Action>

                            <div className="text-xs text-[#72767d]">
                                By registering, you agree to Discord's{' '}
                                <Link href="/tos" className="text-[#00aff4] hover:underline">
                                    Terms of Service
                                </Link>{' '}
                                and Privacy Policy.
                            </div>

                            <div className="text-sm text-[#72767d]">
                                <Link href="/sign-in" className="text-[#00aff4] hover:underline">
                                    Already have an account?
                                </Link>
                            </div>
                        </div>
                    </SignUp.Step>

                    <SignUp.Step
                        name="continue"
                        className="bg-[#36393f] p-8 rounded-lg shadow-2xl"
                    >
                        <div className="text-center mb-6">
                            <h1 className="text-white text-2xl font-bold mb-2">Complete your profile</h1>
                            <p className="text-[#b9bbbe] text-sm">Just a few more details</p>
                        </div>

                        <div className="space-y-4">
                            <Clerk.Field name="username" className="space-y-2">
                                <Clerk.Label className="block text-[#b9bbbe] uppercase text-xs font-bold">
                                    Username <span className="text-[#f04747]">*</span>
                                </Clerk.Label>
                                <Clerk.Input
                                    type="text"
                                    className="w-full bg-[#202225] border-none text-white px-3 py-2.5 rounded focus:outline-none focus:ring-1 focus:ring-[#00aff4]"
                                />
                                <Clerk.FieldError className="block text-[#f04747] text-sm mt-1">
                                    {({ message }) => getErrorMessage(message || '')}
                                </Clerk.FieldError>
                            </Clerk.Field>

                            <SignUp.Action
                                submit
                                className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-2.5 rounded transition-colors"
                            >
                                Continue
                            </SignUp.Action>
                        </div>
                    </SignUp.Step>

                    <SignUp.Step
                        name="verifications"
                        className="bg-[#36393f] p-8 rounded-lg shadow-2xl"
                    >
                        <SignUp.Strategy name="email_code">
                            <div className="text-center mb-6">
                                <h1 className="text-white text-2xl font-bold mb-2">Verify your email</h1>
                                <p className="text-[#b9bbbe] text-sm">
                                    We sent a 6-digit verification code to your email
                                </p>
                            </div>

                            <Clerk.Field name="code">
                                {() => (
                                    <div className="space-y-4">
                                        <CodeInput
                                            onComplete={(code) => {
                                                const input = document.querySelector('input[name="code"]') as HTMLInputElement
                                                if (input) {
                                                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                                                        window.HTMLInputElement.prototype,
                                                        'value'
                                                    )?.set
                                                    nativeInputValueSetter?.call(input, code)

                                                    input.dispatchEvent(new Event('input', { bubbles: true }))
                                                    setTimeout(() => {
                                                        const form = input.closest('form')
                                                        form?.requestSubmit()
                                                    }, 100)
                                                }
                                            }}
                                        />
                                        <Clerk.Input type="text" name="code" className="hidden" />

                                        <SignUp.Action
                                            submit
                                            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-2.5 rounded transition-colors"
                                        >
                                            Verify Email
                                        </SignUp.Action>
                                    </div>
                                )}
                            </Clerk.Field>
                        </SignUp.Strategy>
                    </SignUp.Step>
                </SignUp.Root>
            </div>
        </div>
    )
}