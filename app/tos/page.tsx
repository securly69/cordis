export default function TOS() {
    return (
        <div className="min-h-screen bg-[#2f3136] text-white p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-[#5865F2] mb-8">Terms of Service</h1>

                <div className="space-y-6 text-gray-300">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. User Conduct</h2>
                        <p>
                            Users differ in their tolerance for offensive content. We expect all users to be respectful and kind to one another.
                            Harassment, hate speech, and inappropriate content will not be tolerated.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Privacy Policy</h2>
                        <p>
                            We value your privacy. Your personal information will be handled in accordance with our Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Disclaimers</h2>
                        <p>
                            The service is provided "as is" and "as available" without any warranties of any kind.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Termination</h2>
                        <p>
                            We reserve the right to terminate your access to the site without any advance notice.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-600 text-sm text-gray-400">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    )
}
