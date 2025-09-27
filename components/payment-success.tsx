"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Download, Mail } from "lucide-react"
import Link from "next/link"

export function PaymentSuccess() {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <Card className="bg-card border-border">
        <CardContent className="pt-8 pb-8">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />

          <h1 className="text-3xl font-bold text-card-foreground mb-4">Payment Successful!</h1>

          <p className="text-lg text-muted-foreground mb-8">
            Welcome to Eatnify! Your subscription has been activated and you're ready to transform your restaurant's
            digital presence.
          </p>

          <div className="bg-background rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">What's Next?</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Check Your Email</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent you login credentials and setup instructions.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Download className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Download Resources</h3>
                  <p className="text-sm text-muted-foreground">
                    Access our quick start guide and best practices documentation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
              Access Your Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
              >
                Download Quick Start Guide
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
              >
                Contact Support
              </Button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Need help getting started?{" "}
              <Link href="/support" className="text-primary hover:text-primary/90">
                Contact our support team
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
