import { Header } from "@/components/header"
import  PaymentForm  from "@/components/payment-form"
import { Suspense } from "react"

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <PaymentForm />
        </Suspense>
      </main>
    </div>
  )
}
