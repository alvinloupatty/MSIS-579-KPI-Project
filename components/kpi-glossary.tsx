"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface KpiDefinition {
  Team: string
  Metric_Name: string
  Definition: string
}

interface GlossaryEntry {
  Standard_Metric_Name: string
  Teams: string
  Original_Metrics: string
  Standard_Definition: string
  Original_Definitions: string[]
}

interface KpiGlossaryProps {
  kpiData: KpiDefinition[]
}

export function KpiGlossary({ kpiData }: KpiGlossaryProps) {
  const [glossary, setGlossary] = useState<GlossaryEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Generate glossary from KPI data
    generateGlossary(kpiData)
  }, [kpiData])

  const generateGlossary = (data: KpiDefinition[]) => {
    setLoading(true)

    // Group by normalized metric name
    const metricGroups: Record<string, KpiDefinition[]> = {}
    data.forEach((kpi) => {
      const normalizedName = normalizeMetricName(kpi.Metric_Name)
      if (!metricGroups[normalizedName]) {
        metricGroups[normalizedName] = []
      }
      metricGroups[normalizedName].push(kpi)
    })

    // Create glossary entries
    const glossaryEntries: GlossaryEntry[] = []
    Object.entries(metricGroups).forEach(([normalizedName, kpis]) => {
      const teams = Array.from(new Set(kpis.map((kpi) => kpi.Team)))
      const originalMetrics = Array.from(new Set(kpis.map((kpi) => kpi.Metric_Name)))
      const definitions = kpis.map((kpi) => kpi.Definition)

      glossaryEntries.push({
        Standard_Metric_Name: normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1),
        Teams: teams.join(", "),
        Original_Metrics: originalMetrics.join(", "),
        Standard_Definition: createUnifiedDefinition(definitions),
        Original_Definitions: definitions,
      })
    })

    // Sort by name
    glossaryEntries.sort((a, b) => a.Standard_Metric_Name.localeCompare(b.Standard_Metric_Name))
    setGlossary(glossaryEntries)
    setLoading(false)
  }

  const normalizeMetricName = (name: string): string => {
    // Clean the name
    let cleanName = name.toLowerCase().replace(/[^\w\s]/g, "")

    // Common variations to standardize
    const variations: Record<string, string[]> = {
      rate: ["ratio", "percentage", "%"],
      engagement: ["interaction", "involvement"],
      conversion: ["transform", "convert"],
      retention: ["keep", "maintain"],
      adoption: ["usage", "utilization"],
      satisfaction: ["happiness", "sentiment"],
    }

    // Replace variations with standard terms
    for (const [standard, variants] of Object.entries(variations)) {
      for (const variant of variants) {
        if (cleanName.includes(variant)) {
          cleanName = cleanName.replace(variant, standard)
        }
      }
    }

    return cleanName
  }

  const createUnifiedDefinition = (definitions: string[]): string => {
    if (!definitions.length) return ""
    if (definitions.length === 1) return definitions[0]

    // Find the most comprehensive definition (usually the longest)
    let mostComprehensive = definitions[0]
    for (const def of definitions) {
      if (def.length > mostComprehensive.length) {
        mostComprehensive = def
      }
    }

    return mostComprehensive
  }

  const handleExport = () => {
    // In a real implementation, this would export the glossary to CSV
    alert("In a real implementation, this would export the glossary as a CSV file.")
  }

  // Filter glossary based on search
  const filteredGlossary = glossary.filter(
    (entry) =>
      entry.Standard_Metric_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.Standard_Definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.Teams.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">KPI Glossary</h2>
        <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
          <Download size={16} />
          Export Glossary
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search glossary..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Generating glossary...</div>
      ) : (
        <div className="space-y-6">
          {filteredGlossary.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No matching entries found.</div>
          ) : (
            filteredGlossary.map((entry, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{entry.Standard_Metric_Name}</CardTitle>
                      <CardDescription>Used by {entry.Teams}</CardDescription>
                    </div>
                    <Badge variant="outline">{entry.Original_Metrics.split(", ").length} variants</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Standard Definition:</p>
                      <p className="text-gray-600">{entry.Standard_Definition}</p>
                    </div>

                    <div>
                      <p className="font-medium">Original Metrics:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {entry.Original_Metrics.split(", ").map((metric, i) => (
                          <Badge key={i} variant="secondary">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {entry.Original_Definitions.length > 1 && (
                      <div>
                        <p className="font-medium">Original Definitions:</p>
                        <div className="space-y-2 mt-1">
                          {entry.Original_Definitions.map((def, i) => (
                            <div key={i} className="text-sm text-gray-600 border-l-2 border-gray-200 pl-3">
                              {def}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
