import { Header } from "@/components/header"
import  PaymentForm  from "@/components/payment-form"
import { Suspense } from "react"

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="">
        <Suspense fallback={<div>Loading...</div>}>
          <PaymentForm />
        </Suspense>
      </main>
    </div>
  )
}
