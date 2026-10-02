import {Button} from "./Buttons";

export function HabitForm() {
    return (<form className="flex flex-col gap-2">
        <input className="flex-1 rounded-lg bg-gray-800 px-4 py-2 outline-none focus-visible:ring2 focus-visible:ring-blue-500" placeholder="Habit name" />
        <Button>Add Habit</Button>
    </form>
    )
}