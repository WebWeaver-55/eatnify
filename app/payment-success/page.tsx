import { Header } from "@/components/header"
import { PaymentSuccess } from "@/components/payment-success"

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="">
        <PaymentSuccess />
      </main>
    </div>
  )
}
