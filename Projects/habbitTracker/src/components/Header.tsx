import { Button } from "./Buttons";

export function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Habbit Tracker</h1>
        <span className="text-zinc-400 text-sm"> 1 / 1 done today</span>
      </div>
   

        <div className="flex flex-col gap-1 items-end">
          <span className="text-zinc-300 text-sm"> Apr 6 - Apr 12</span>
        <div className="flex items-center gap-3">
         <Button>Prev</Button>
          <Button>Next</Button>
      </div>
        
      </div>
    </header>
  )
}