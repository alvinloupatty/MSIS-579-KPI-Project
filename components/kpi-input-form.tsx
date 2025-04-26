"use client"

import type React from "react"

import { useState } from "react"
import type { TeamKpiDefinition } from "@/types/kpi-types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface KpiInputFormProps {
  onAddKpi: (kpi: TeamKpiDefinition) => void
}

export function KpiInputForm({ onAddKpi }: KpiInputFormProps) {
  const [kpiData, setKpiData] = useState<TeamKpiDefinition>({
    team: "",
    kpiName: "",
    definition: "",
    formula: "",
    dataSource: "",
    frequency: "",
    owner: "",
    target: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setKpiData({ ...kpiData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setKpiData({ ...kpiData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!kpiData.team || !kpiData.kpiName || !kpiData.definition) {
      alert("Please fill in the required fields: Team, KPI Name, and Definition")
      return
    }

    onAddKpi(kpiData)

    // Reset form
    setKpiData({
      team: "",
      kpiName: "",
      definition: "",
      formula: "",
      dataSource: "",
      frequency: "",
      owner: "",
      target: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="team">Team *</Label>
          <Select value={kpiData.team} onValueChange={(value) => handleSelectChange("team", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Product">Product</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Customer Success">Customer Success</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="kpiName">KPI Name *</Label>
          <Input
            id="kpiName"
            name="kpiName"
            value={kpiData.kpiName}
            onChange={handleChange}
            placeholder="e.g., Conversion Rate"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="definition">Definition *</Label>
        <Textarea
          id="definition"
          name="definition"
          value={kpiData.definition}
          onChange={handleChange}
          placeholder="How does your team define this KPI?"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="formula">Formula or Calculation Method</Label>
        <Textarea
          id="formula"
          name="formula"
          value={kpiData.formula}
          onChange={handleChange}
          placeholder="e.g., (Number of conversions / Total visitors) × 100"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dataSource">Data Source</Label>
          <Input
            id="dataSource"
            name="dataSource"
            value={kpiData.dataSource}
            onChange={handleChange}
            placeholder="e.g., Google Analytics, CRM"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency">Reporting Frequency</Label>
          <Select value={kpiData.frequency} onValueChange={(value) => handleSelectChange("frequency", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Quarterly">Quarterly</SelectItem>
              <SelectItem value="Annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="owner">KPI Owner</Label>
          <Input
            id="owner"
            name="owner"
            value={kpiData.owner}
            onChange={handleChange}
            placeholder="Who is responsible for this KPI?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="target">Target Value</Label>
          <Input
            id="target"
            name="target"
            value={kpiData.target}
            onChange={handleChange}
            placeholder="e.g., 15% increase YoY"
          />
        </div>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
      >
        Add KPI Definition
      </button>
    </form>
  )
}
