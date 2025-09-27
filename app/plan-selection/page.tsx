import { Header } from "@/components/header"
import PlanSelectionForm  from "@/components/plan-selection-form"

export default function PlanSelectionPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <PlanSelectionForm />
      </main>
    </div>
  )
}
