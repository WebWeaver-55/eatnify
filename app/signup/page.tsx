import { Header } from "@/components/header"
import SignupForm from "@/components/signup-form";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="">
        <SignupForm />
      </main>
    </div>
  )
}
