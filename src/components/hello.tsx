"use client"

import React from "react"

export interface HelloProps {
  name?: string
}

export function Hello({ name = "Mundo" }: HelloProps) {
  return (
    <div className="p-3 rounded-md bg-sky-50 dark:bg-sky-900 text-sky-900 dark:text-sky-200 border border-sky-100 dark:border-sky-800">
      Hola {name}
    </div>
  )
}

export default Hello
