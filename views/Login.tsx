import React from "react";
import { useAuth } from "../context/AuthContext";
import { LogIn, Sparkles } from "lucide-react";
import { DynamicBackground } from "../components/DynamicBackground";

export function Login() {
    const { signInWithGoogle } = useAuth();

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Reuse the app's dynamic background */}
            <DynamicBackground />

            {/* Glassmorphism Card */}
            <div className="relative z-10 w-full max-w-md p-8 m-4">
                <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl bg-black/40">
                    <div className="text-center space-y-2 mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-4 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                            <Sparkles className="w-8 h-8 text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">NowTracker</h2>
                        <p className="text-gray-400 text-sm">Focus on what matters. Track your time with style.</p>
                    </div>

                    <div className="space-y-6">
                        <button
                            onClick={signInWithGoogle}
                            className="group relative w-full flex items-center justify-center gap-3 py-4 px-6 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02]"
                        >
                            <LogIn className="w-5 h-5 text-gray-900" />
                            <span>Sign in with Google</span>
                        </button>

                        <div className="pt-8 border-t border-white/10 text-center">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Secure & Private</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-600">
                        &copy; {new Date().getFullYear()} NowTracker. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
