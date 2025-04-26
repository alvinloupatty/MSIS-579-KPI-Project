"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRightLeft } from "lucide-react"

interface KpiDefinition {
  Team: string
  Metric_Name: string
  Definition: string
}

interface KpiTranslatorProps {
  kpiData: KpiDefinition[]
}

export function KpiTranslator({ kpiData }: KpiTranslatorProps) {
  const [message, setMessage] = useState("")
  const [fromContext, setFromContext] = useState("")
  const [toContext, setToContext] = useState("")
  const [translatedMessage, setTranslatedMessage] = useState("")
  const [translatedTerms, setTranslatedTerms] = useState<any[]>([])

  // Get unique teams
  const teams = Array.from(new Set(kpiData.map((item) => item.Team)))

  // Team-specific glossaries
  const teamGlossaries: Record<string, Record<string, string>> = {}
  teams.forEach((team) => {
    teamGlossaries[team] = {}
    const teamKpis = kpiData.filter((kpi) => kpi.Team === team)
    teamKpis.forEach((kpi) => {
      teamGlossaries[team][kpi.Metric_Name.toLowerCase()] = kpi.Definition
    })
  })

  const handleTranslate = () => {
    if (!message || !fromContext || !toContext) {
      alert("Please fill in all fields")
      return
    }

    if (fromContext === toContext) {
      setTranslatedMessage(message)
      setTranslatedTerms([])
      return
    }

    // Identify KPI terms in the message
    const words = message.split(/\s+/)
    const identifiedTerms: any[] = []
    const fromGlossary = teamGlossaries[fromContext] || {}
    const toGlossary = teamGlossaries[toContext] || {}

    // Check for exact matches of KPI terms
    for (const word of words) {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, "")

      // Check if this word is a KPI term for the source team
      for (const [term, definition] of Object.entries(fromGlossary)) {
        if (term.toLowerCase().includes(cleanWord) || cleanWord.includes(term.toLowerCase())) {
          // Find equivalent in target team
          let targetTerm = term
          let targetDefinition = "No equivalent found"

          // Look for similar terms in target team
          for (const [toTerm, toDef] of Object.entries(toGlossary)) {
            if (
              toTerm.toLowerCase().includes(term.toLowerCase()) ||
              term.toLowerCase().includes(toTerm.toLowerCase())
            ) {
              targetTerm = toTerm
              targetDefinition = toDef
              break
            }
          }

          identifiedTerms.push({
            originalTerm: term,
            fromContext,
            fromDefinition: definition,
            toContext,
            toTerm: targetTerm,
            toDefinition: targetDefinition,
          })

          break
        }
      }
    }

    // Create translated message
    let translated = message
    identifiedTerms.forEach((term) => {
      if (term.originalTerm !== term.toTerm) {
        const regex = new RegExp(`\\b${term.originalTerm}\\b`, "gi")
        translated = translated.replace(regex, `${term.toTerm} (${term.originalTerm} in ${fromContext} terms)`)
      }
    })

    setTranslatedMessage(translated)
    setTranslatedTerms(identifiedTerms)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">KPI Translator</h2>
      <p className="text-gray-600">
        Translate metrics and KPIs between different team contexts to improve cross-team communication.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Original Message</CardTitle>
            <CardDescription>Enter the message containing KPIs to translate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">From Team Context</label>
              <Select value={fromContext} onValueChange={setFromContext}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <Textarea
                placeholder="Enter message with KPI terms to translate..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">To Team Context</label>
              <Select value={toContext} onValueChange={setToContext}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleTranslate} className="w-full flex items-center justify-center gap-2">
              <ArrowRightLeft size={16} />
              Translate
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Translated Message</CardTitle>
            <CardDescription>
              {fromContext && toContext
                ? `From ${fromContext} context to ${toContext} context`
                : "Select teams to translate between contexts"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {translatedMessage ? (
              <>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="whitespace-pre-wrap">{translatedMessage}</p>
                </div>

                {translatedTerms.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Translated Terms:</h4>
                    <div className="space-y-3">
                      {translatedTerms.map((term, idx) => (
                        <div key={idx} className="border-l-4 border-emerald-200 pl-3 py-1">
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {term.originalTerm} ({fromContext})
                            </span>
                            <ArrowRightLeft size={16} className="text-gray-400" />
                            <span className="font-medium">
                              {term.toTerm} ({toContext})
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <div>{term.fromDefinition}</div>
                            <div className="mt-1">{term.toDefinition}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Enter a message and select team contexts to see the translation.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
