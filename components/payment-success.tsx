"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Mail, Download, Smartphone } from "lucide-react"
import Link from "next/link"

export function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-6 sm:p-8">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse"></div>
                <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 text-green-500 relative z-10" />
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Payment Successful!
              </h1>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Welcome to Eatnify! Your subscription is now active and you're ready to transform your restaurant's digital presence.
              </p>
            </div>

            {/* Simple Message */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 mb-8">
              <p className="text-sm sm:text-base text-gray-700 text-center leading-relaxed">
                Your account is ready! Check your email for login credentials and click below to access your dashboard.
              </p>
            </div>

            {/* Single Login Button */}
            <Link href="/login" className="block">
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 sm:py-5 text-base sm:text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl rounded-xl"
                size="lg"
              >
                Continue to Login
                <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </Link>

            {/* Support Link */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-xs sm:text-sm text-gray-500">
                Need help getting started?{" "}
                <Link 
                  href="/support" 
                  className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional floating elements for visual appeal */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl"></div>
      </div>
    </div>
  )
}