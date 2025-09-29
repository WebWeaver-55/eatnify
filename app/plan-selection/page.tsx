import { Header } from "@/components/header"
import PlanSelectionForm  from "@/components/plan-selection-form"

export default function PlanSelectionPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="">
        <PlanSelectionForm />
      </main>
    </div>
  )
}
