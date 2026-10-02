

export function HabitList() {
    const habits = [
      "Drink Water",
        "Exercise",
        "Read a Book",
        "Meditate",
        "Sleep Early"

    ];
  if (habits.length === 0) {
    return <p className="text-gray-500">No habits yet. Please add some habits!</p>
}
return <div className="flex flex-col gap-3">
    {habits.map((habit) => (
       <h1>{habit}  </h1>
    ))}

</div>
}
