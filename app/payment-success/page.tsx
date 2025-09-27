import { Header } from "@/components/header"
import { PaymentSuccess } from "@/components/payment-success"

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <PaymentSuccess />
      </main>
    </div>
  )
}
