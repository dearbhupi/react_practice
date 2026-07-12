
import { HabitForm } from "./components/HabitForm"
import { HabitList } from "./components/HabitList"
import { Header } from "./components/Header"


export default function App() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <Header />
      <HabitForm />
      <HabitList />
    </div>
  )
}

