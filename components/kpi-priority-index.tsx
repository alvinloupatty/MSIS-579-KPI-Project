"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ArrowUpDown, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface KpiDefinition {
  Team: string
  Metric_Name: string
  Definition: string
}

interface KpiWithPriority extends KpiDefinition {
  Team_Weight: number
  Total_Team_Weight: number
  Definition_Variants: number
  Priority_Index: number
  Normalized_Metric: string
}

interface KpiPriorityIndexProps {
  kpiData: KpiDefinition[]
}

export function KpiPriorityIndex({ kpiData }: KpiPriorityIndexProps) {
  // Default team weights
  const defaultTeamWeights: Record<string, number> = {
    Marketing: 1.0,
    Sales: 1.5,
    Product: 2.0,
    "Customer Success": 1.2,
    Data: 0.8,
    Finance: 1.0,
    Legal: 0.7,
  }

  const [teamWeights, setTeamWeights] = useState<Record<string, number>>(defaultTeamWeights)
  const [sortField, setSortField] = useState<string>("Priority_Index")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [searchTerm, setSearchTerm] = useState("")

  // Get unique teams
  const teams = Array.from(new Set(kpiData.map((item) => item.Team)))

  // Compute priority index
  const priorityData = computePriorityIndex(kpiData, teamWeights)

  // Sort data
  const sortedData = [...priorityData].sort((a, b) => {
    if (sortField === "Priority_Index") {
      return sortDirection === "asc" ? a.Priority_Index - b.Priority_Index : b.Priority_Index - a.Priority_Index
    } else if (sortField === "Definition_Variants") {
      return sortDirection === "asc"
        ? a.Definition_Variants - b.Definition_Variants
        : b.Definition_Variants - a.Definition_Variants
    } else if (sortField === "Total_Team_Weight") {
      return sortDirection === "asc"
        ? a.Total_Team_Weight - b.Total_Team_Weight
        : b.Total_Team_Weight - a.Total_Team_Weight
    } else {
      // Default to sorting by Metric_Name
      return sortDirection === "asc"
        ? a.Metric_Name.localeCompare(b.Metric_Name)
        : b.Metric_Name.localeCompare(a.Metric_Name)
    }
  })

  // Filter data based on search
  const filteredData = sortedData.filter(
    (item) =>
      item.Metric_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Team.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Group by normalized metric name to show conflicts
  const metricGroups: Record<string, KpiWithPriority[]> = {}
  filteredData.forEach((kpi) => {
    if (!metricGroups[kpi.Normalized_Metric]) {
      metricGroups[kpi.Normalized_Metric] = []
    }
    metricGroups[kpi.Normalized_Metric].push(kpi)
  })

  // Sort groups by priority index
  const sortedGroups = Object.entries(metricGroups).sort(([, a], [, b]) => {
    const aPriority = a[0]?.Priority_Index || 0
    const bPriority = b[0]?.Priority_Index || 0
    return bPriority - aPriority
  })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleTeamWeightChange = (team: string, value: number[]) => {
    setTeamWeights({
      ...teamWeights,
      [team]: value[0],
    })
  }

  const resetWeights = () => {
    setTeamWeights(defaultTeamWeights)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">KPI Alignment Priority</h2>
          <p className="text-gray-600">
            Prioritize which KPIs to align first based on team importance and definition conflicts
          </p>
        </div>
        <Button onClick={resetWeights} variant="outline">
          Reset Weights
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Weights</CardTitle>
          <CardDescription>Adjust the importance of each team's KPIs in the alignment process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.map((team) => (
              <div key={team} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>{team}</Label>
                  <span className="text-sm font-medium">{teamWeights[team] || 1.0}</span>
                </div>
                <Slider
                  value={[teamWeights[team] || 1.0]}
                  min={0.1}
                  max={3.0}
                  step={0.1}
                  onValueChange={(value) => handleTeamWeightChange(team, value)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mb-4">
        <Input
          placeholder="Search metrics or teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSort("Metric_Name")}>
                <div className="flex items-center">
                  Metric Name
                  {sortField === "Metric_Name" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead>Teams</TableHead>
              <TableHead className="w-[150px] cursor-pointer" onClick={() => handleSort("Definition_Variants")}>
                <div className="flex items-center">
                  Definition Variants
                  {sortField === "Definition_Variants" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="ml-1 h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Number of different definitions for this metric</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead className="w-[150px] cursor-pointer" onClick={() => handleSort("Total_Team_Weight")}>
                <div className="flex items-center">
                  Team Weight
                  {sortField === "Total_Team_Weight" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="ml-1 h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sum of weights for all teams using this metric</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead className="w-[150px] cursor-pointer" onClick={() => handleSort("Priority_Index")}>
                <div className="flex items-center">
                  Priority Index
                  {sortField === "Priority_Index" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="ml-1 h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Team Weight ÷ Definition Variants (higher = higher priority)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedGroups.map(([normalizedMetric, kpis]) => {
              const firstKpi = kpis[0]
              const hasConflicts = kpis.length > 1

              return (
                <TableRow key={normalizedMetric} className={hasConflicts ? "bg-amber-50" : ""}>
                  <TableCell className="font-medium">
                    {firstKpi.Metric_Name}
                    {hasConflicts && (
                      <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
                        Conflicts
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(new Set(kpis.map((k) => k.Team))).map((team, i) => (
                        <Badge key={i} variant="outline">
                          {team}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {firstKpi.Definition_Variants}
                    {firstKpi.Definition_Variants > 1 && (
                      <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-red-200">
                        Misaligned
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{firstKpi.Total_Team_Weight.toFixed(1)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${Math.min(firstKpi.Priority_Index * 20, 100)}%` }}
                      ></div>
                      <span className="ml-2">{firstKpi.Priority_Index.toFixed(1)}</span>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// Helper function to compute priority index
function computePriorityIndex(data: KpiDefinition[], teamWeights: Record<string, number>): KpiWithPriority[] {
  // Normalize metric names to group similar ones
  const dataWithNormalized = data.map((kpi) => ({
    ...kpi,
    Normalized_Metric: kpi.Metric_Name.toLowerCase().trim(),
  }))

  // Map team weights
  const dataWithWeights = dataWithNormalized.map((kpi) => ({
    ...kpi,
    Team_Weight: teamWeights[kpi.Team] || 1.0,
  }))

  // Calculate total team weight per metric
  const metricGroups: Record<string, KpiWithPriority[]> = {}
  dataWithWeights.forEach((kpi) => {
    if (!metricGroups[kpi.Normalized_Metric]) {
      metricGroups[kpi.Normalized_Metric] = []
    }
    metricGroups[kpi.Normalized_Metric].push(kpi as KpiWithPriority)
  })

  // Calculate total weights and definition variants
  const result: KpiWithPriority[] = []
  Object.entries(metricGroups).forEach(([normalizedMetric, kpis]) => {
    const totalTeamWeight = kpis.reduce((sum, kpi) => sum + kpi.Team_Weight, 0)
    const definitionVariants = new Set(kpis.map((kpi) => kpi.Definition.toLowerCase().trim())).size
    const priorityIndex = totalTeamWeight / definitionVariants

    kpis.forEach((kpi) => {
      result.push({
        ...kpi,
        Total_Team_Weight: totalTeamWeight,
        Definition_Variants: definitionVariants,
        Priority_Index: priorityIndex,
      })
    })
  })

  return result
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-medium">{children}</div>
}
