import type { ReactNode } from "react"

type ButtonProps = {
    children: ReactNode
}

export function Button({children}: ButtonProps) {
    return  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"> {children}</button>
        
}