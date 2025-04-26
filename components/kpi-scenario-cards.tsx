"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface KpiDefinition {
  Team: string
  Metric_Name: string
  Definition: string
}

interface ScenarioDetail {
  teams: string[]
  conflict: string
}

interface Scenario {
  concept: string
  title: string
  metrics: KpiDefinition[]
  realWorldExample: string
  conflictDetails: ScenarioDetail[]
}

interface KpiScenarioCardsProps {
  kpiData: KpiDefinition[]
}

export function KpiScenarioCards({ kpiData }: KpiScenarioCardsProps) {
  const [activeTab, setActiveTab] = useState("all")

  // Generate scenarios based on the KPI data
  const scenarios = generateScenarios(kpiData)

  // Filter scenarios based on active tab
  const filteredScenarios = activeTab === "all" ? scenarios : scenarios.filter((s) => s.concept === activeTab)

  // Get unique concepts for tabs
  const concepts = Array.from(new Set(scenarios.map((s) => s.concept)))

  // Get team color class
  const getTeamColorClass = (team: string) => {
    const teamMap: Record<string, string> = {
      Marketing: "bg-purple-100 border-purple-200 text-purple-800",
      Sales: "bg-blue-100 border-blue-200 text-blue-800",
      Product: "bg-green-100 border-green-200 text-green-800",
      "Customer Success": "bg-yellow-100 border-yellow-200 text-yellow-800",
      Success: "bg-yellow-100 border-yellow-200 text-yellow-800",
      Data: "bg-red-100 border-red-200 text-red-800",
      Finance: "bg-indigo-100 border-indigo-200 text-indigo-800",
      Legal: "bg-gray-100 border-gray-200 text-gray-800",
    }

    return teamMap[team] || "bg-gray-100 border-gray-200 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Scenario Cards</h2>
        <p className="text-gray-600">Real-world examples of KPI conflicts</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Scenarios</TabsTrigger>
          {concepts.map((concept) => (
            <TabsTrigger key={concept} value={concept} className="capitalize">
              {concept.replace("_", " ")}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="grid grid-cols-1 gap-8">
          {filteredScenarios.map((scenario, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="capitalize">{scenario.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 bg-gray-50 border-b">
                  <h3 className="text-lg font-semibold mb-2">Real-World Scenario:</h3>
                  <p className="text-gray-800">{scenario.realWorldExample}</p>
                </div>

                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold mb-3">Conflicting Interpretations:</h3>
                  <div className="space-y-4">
                    {scenario.conflictDetails.map((detail, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {detail.teams.map((team, i) => (
                            <Badge key={i} variant="outline" className={getTeamColorClass(team)}>
                              {team}
                            </Badge>
                          ))}
                        </div>
                        <p>{detail.conflict}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-white">
                  <h3 className="text-lg font-semibold mb-3">Related KPIs:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scenario.metrics.slice(0, 6).map((metric, idx) => (
                      <div key={idx} className={`p-3 rounded-md border ${getTeamColorClass(metric.Team)}`}>
                        <div className="font-semibold">
                          {metric.Team}: {metric.Metric_Name}
                        </div>
                        <div className="text-sm">{metric.Definition}</div>
                      </div>
                    ))}
                  </div>
                  {scenario.metrics.length > 6 && (
                    <div className="mt-2 text-sm text-gray-500">
                      +{scenario.metrics.length - 6} more related metrics
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Tabs>
    </div>
  )
}

// Helper function to generate scenarios based on KPI data
function generateScenarios(kpiData: KpiDefinition[]): Scenario[] {
  // Define conceptual categories for KPIs
  const conceptMap: Record<string, KpiDefinition[]> = {
    engagement: [],
    conversion: [],
    retention: [],
    user_activity: [],
    customer_success: [],
    lead_quality: [],
    revenue: [],
  }

  // Analyze each metric and categorize by concept
  kpiData.forEach((kpi) => {
    const defLower = kpi.Definition.toLowerCase()
    const metricLower = kpi.Metric_Name.toLowerCase()

    // Check for engagement related metrics
    if (
      defLower.includes("email") ||
      defLower.includes("click") ||
      defLower.includes("open") ||
      defLower.includes("session") ||
      defLower.includes("login") ||
      defLower.includes("webinar") ||
      metricLower.includes("engagement")
    ) {
      conceptMap.engagement.push(kpi)
    }

    // Check for conversion related metrics
    if (
      defLower.includes("sign up") ||
      defLower.includes("trial") ||
      defLower.includes("cta") ||
      defLower.includes("deal") ||
      defLower.includes("closed") ||
      metricLower.includes("conversion") ||
      metricLower.includes("qualified")
    ) {
      conceptMap.conversion.push(kpi)
    }

    // Check for retention related metrics
    if (
      defLower.includes("return") ||
      defLower.includes("churn") ||
      defLower.includes("support ticket") ||
      defLower.includes("nps") ||
      metricLower.includes("retention") ||
      metricLower.includes("churn")
    ) {
      conceptMap.retention.push(kpi)
    }

    // Check for user activity metrics
    if (
      defLower.includes("feature") ||
      defLower.includes("onboarding") ||
      defLower.includes("session") ||
      defLower.includes("log in") ||
      defLower.includes("usage") ||
      metricLower.includes("activation") ||
      metricLower.includes("feature") ||
      metricLower.includes("user")
    ) {
      conceptMap.user_activity.push(kpi)
    }

    // Check for customer success metrics
    if (
      defLower.includes("support") ||
      defLower.includes("nps") ||
      defLower.includes("satisfaction") ||
      defLower.includes("feedback") ||
      kpi.Team.toLowerCase().includes("success") ||
      metricLower.includes("satisfaction")
    ) {
      conceptMap.customer_success.push(kpi)
    }

    // Check for lead quality metrics
    if (
      defLower.includes("lead") ||
      defLower.includes("score") ||
      defLower.includes("sdr") ||
      metricLower.includes("lead") ||
      metricLower.includes("pipeline")
    ) {
      conceptMap.lead_quality.push(kpi)
    }

    // Check for revenue metrics
    if (
      defLower.includes("revenue") ||
      defLower.includes("cost") ||
      defLower.includes("mrr") ||
      defLower.includes("cac") ||
      defLower.includes("roi") ||
      defLower.includes("clv") ||
      kpi.Team.toLowerCase() === "finance"
    ) {
      conceptMap.revenue.push(kpi)
    }
  })

  // Filter out concepts with less than 2 metrics (no conflicts)
  const filteredConcepts: Record<string, KpiDefinition[]> = {}
  for (const [concept, metrics] of Object.entries(conceptMap)) {
    if (metrics.length > 1) {
      filteredConcepts[concept] = metrics
    }
  }

  // Generate scenario cards for each concept
  const scenarios: Scenario[] = []

  for (const [concept, metrics] of Object.entries(filteredConcepts)) {
    // Create scenario structure based on concept
    const scenario: Scenario = {
      concept,
      title: `Conflict in ${concept.replace("_", " ")} measurement`,
      metrics,
      realWorldExample: "",
      conflictDetails: [],
    }

    // Populate with detailed conflict examples based on concept
    if (concept === "engagement") {
      scenario.realWorldExample =
        "A user scrolls through the entire product page for 5 minutes, watches a demo video, but doesn't click any buttons or forms."
      scenario.conflictDetails = [
        {
          teams: ["Marketing", "Data"],
          conflict:
            "Marketing's Engagement Rate (based on clicks) shows 0% engagement while Data's Session Duration shows high engagement (5 minutes).",
        },
        {
          teams: ["Marketing", "Customer Success"],
          conflict:
            "Marketing's Bounce Rate classifies this as a bounce (no interaction), but Customer Success's Engagement Score counts the video view as engagement.",
        },
      ]
    } else if (concept === "conversion") {
      scenario.realWorldExample =
        "A lead from a paid campaign downloads a whitepaper, enters their email, but doesn't book a demo call or respond to follow-ups."
      scenario.conflictDetails = [
        {
          teams: ["Marketing", "Sales"],
          conflict:
            "Marketing counts this as a conversion (lead from paid campaign that completed a CTA), but Sales doesn't consider it a Qualified Lead.",
        },
        {
          teams: ["Marketing", "Sales"],
          conflict:
            "This lead appears in Marketing's conversion metrics but hurts Sales' Close Rate when counted among total leads.",
        },
      ]
    } else if (concept === "retention") {
      scenario.realWorldExample =
        "A user who had 3 support tickets last month returns to the platform after 30 days but only checks account settings and leaves."
      scenario.conflictDetails = [
        {
          teams: ["Customer Success", "Data"],
          conflict:
            "Customer Success flags them as Churn Risk (>2 support tickets) while Data counts them as Retained (returned after 30 days).",
        },
        {
          teams: ["Customer Success", "Customer Success"],
          conflict: "Within CS's own metrics, this user is both a Churn Risk (tickets) and not a Churn Risk (NPS > 7).",
        },
      ]
    } else if (concept === "user_activity") {
      scenario.realWorldExample =
        "A user logs in 6 times per week but only uses the reporting dashboard, ignoring newly released features."
      scenario.conflictDetails = [
        {
          teams: ["Product", "Product"],
          conflict:
            "Counted as a Power User (>5 logins, completes core flows) but has 0% Feature Adoption (no usage of new features).",
        },
        {
          teams: ["Product", "Customer Success"],
          conflict:
            "Product sees them as highly engaged (Power User), while Customer Success may see lower Engagement Score (limited feature usage).",
        },
      ]
    } else if (concept === "customer_success") {
      scenario.realWorldExample =
        "A customer submits 3 support tickets in a month, all requesting advanced functionality, but gives a 9/10 NPS rating."
      scenario.conflictDetails = [
        {
          teams: ["Customer Success", "Customer Success"],
          conflict:
            "CS flags them as potential Churn Risk due to ticket volume but also as a promoter due to high NPS.",
        },
        {
          teams: ["Customer Success", "Product"],
          conflict:
            "CS sees the high ticket volume as concerning, but Product might see this as valuable User Satisfaction feedback for new features.",
        },
      ]
    } else if (concept === "lead_quality") {
      scenario.realWorldExample =
        "A lead from a Fortune 500 company with perfect demographic match has clicked on only one email and hasn't booked a demo."
      scenario.conflictDetails = [
        {
          teams: ["Sales", "Marketing"],
          conflict:
            "Sales rates this as high Lead Quality based on demographics, but Marketing shows low Conversion metrics.",
        },
        {
          teams: ["Sales", "Sales"],
          conflict:
            "This lead has high Pipeline Velocity potential (high value) but decreases Close Rate when counted in the denominator.",
        },
      ]
    } else if (concept === "revenue") {
      scenario.realWorldExample =
        "A customer signs up for the lowest-tier plan ($10/month) but uses every feature extensively and has been active for 2 years."
      scenario.conflictDetails = [
        {
          teams: ["Finance", "Product"],
          conflict:
            "Finance counts them as low Customer Lifetime Value based on revenue, but Product sees them as a high-value Power User.",
        },
        {
          teams: ["Finance", "Customer Success"],
          conflict:
            "Finance's CAC calculation may exclude them as a 'qualified' customer due to low plan tier, but Customer Success shows them as a promoter.",
        },
      ]
    }

    scenarios.push(scenario)
  }

  return scenarios
}
