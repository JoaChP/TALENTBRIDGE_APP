// Tarjeta que muestra información resumida de una práctica
"use client"

import Image from "next/image"
import { MapPin, Clock, Briefcase } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import type { Practice } from "../types"

interface PracticeCardProps {
  practice: Practice
}

// Componente exportado: PracticeCard
// Muestra logo, título, tags y botón para ver detalles
export function PracticeCard({ practice }: PracticeCardProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.location.href = `/oferta/${practice.id}`
  }

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Image
            src={practice.company.logoUrl || "/placeholder.svg"}
            alt={`Logo de ${practice.company.name}`}
            width={48}
            height={48}
            className="h-12 w-12 rounded-lg object-cover"
          />
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-semibold leading-tight text-balance">{practice.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{practice.company.name}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {practice.city}, {practice.country}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {practice.postedAgo}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                <Briefcase className="mr-1 h-3 w-3" aria-hidden="true" />
                {practice.modality}
              </Badge>
              <Badge variant="secondary">{practice.durationMonths} meses</Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              {practice.skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <a href={`/oferta/${practice.id}`} onClick={handleClick} className="flex-1">
                <Button className="w-full">
                  Ver detalles
                </Button>
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
