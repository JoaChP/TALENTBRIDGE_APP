"use client"

import { MapPin, Clock, Briefcase } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import type { Practice } from "../types"
import { useNavigate } from "react-router-dom"

interface PracticeCardProps {
  practice: Practice
}

export function PracticeCard({ practice }: PracticeCardProps) {
  const navigate = useNavigate()

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <img
            src={practice.company.logoUrl || "/placeholder.svg"}
            alt={`Logo de ${practice.company.name}`}
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
              <Button className="flex-1" onClick={() => navigate(`/oferta/${practice.id}`)}>
                Ver detalles
              </Button>
              <Button variant="outline" size="icon" aria-label="Guardar práctica">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
