interface KpiDefinition {
  Team: string
  Metric_Name: string
  Definition: string
}

export function analyzeKpis(teamKpis: KpiDefinition[]) {
  // Group KPIs by name
  const kpiGroups = groupKpisByName(teamKpis)

  // Generate summaries
  const summaries = generateSummaries(kpiGroups)

  // Identify conflicts
  const conflicts = identifyConflicts(kpiGroups)

  // Generate translations
  const translations = generateTranslations(kpiGroups)

  // Generate recommendations
  const recommendations = generateRecommendations(kpiGroups, conflicts)

  return {
    summaries,
    conflicts,
    translations,
    recommendations,
  }
}

function groupKpisByName(teamKpis: KpiDefinition[]) {
  const groups: Record<string, KpiDefinition[]> = {}

  // Normalize KPI names (lowercase, remove spaces)
  teamKpis.forEach((kpi) => {
    const normalizedName = kpi.Metric_Name.toLowerCase().trim()
    if (!groups[normalizedName]) {
      groups[normalizedName] = []
    }
    groups[normalizedName].push(kpi)
  })

  return groups
}

function generateSummaries(kpiGroups: Record<string, KpiDefinition[]>) {
  return Object.entries(kpiGroups).map(([kpiName, kpis]) => {
    const teams = kpis.map((kpi) => kpi.Team)
    const definitions = kpis.map((kpi) => ({
      team: kpi.Team,
      definition: kpi.Definition,
    }))

    return {
      metricName: kpis[0].Metric_Name, // Use the first KPI's name as the display name
      teams,
      definitions,
    }
  })
}

function identifyConflicts(kpiGroups: Record<string, KpiDefinition[]>) {
  const conflicts = []

  for (const [kpiName, kpis] of Object.entries(kpiGroups)) {
    if (kpis.length > 1) {
      // Check for definition conflicts
      const definitionSet = new Set(kpis.map((kpi) => kpi.Definition.toLowerCase().trim()))

      if (definitionSet.size > 1) {
        conflicts.push({
          metricName: kpis[0].Metric_Name,
          description: `Different teams have conflicting definitions for "${kpis[0].Metric_Name}"`,
          details: kpis.map((kpi) => ({
            team: kpi.Team,
            definition: kpi.Definition,
          })),
          impact:
            "This misalignment could lead to teams optimizing for different outcomes while thinking they're working toward the same goal.",
        })
      }
    }
  }

  return conflicts
}

function generateTranslations(kpiGroups: Record<string, KpiDefinition[]>) {
  return Object.entries(kpiGroups)
    .filter(([_, kpis]) => kpis.length > 1) // Only include KPIs used by multiple teams
    .map(([kpiName, kpis]) => {
      return {
        metricName: kpis[0].Metric_Name,
        teamTranslations: kpis.map((kpi) => {
          return {
            team: kpi.Team,
            meaning: kpi.Definition,
            context: determineMetricContext(kpi.Team),
          }
        }),
      }
    })
}

function determineMetricContext(team: string) {
  // Provide context for how each team typically uses metrics
  const teamContexts: Record<string, string> = {
    Marketing: "typically focuses on acquisition and awareness metrics",
    Sales: "typically focuses on conversion and revenue metrics",
    Product: "typically focuses on engagement and retention metrics",
    Engineering: "typically focuses on performance and reliability metrics",
    Data: "typically focuses on data quality and integrity metrics",
    "Customer Success": "typically focuses on satisfaction and retention metrics",
    Finance: "typically focuses on revenue and cost metrics",
  }

  return teamContexts[team] || "uses this metric in their specific context"
}

function generateRecommendations(kpiGroups: Record<string, KpiDefinition[]>, conflicts: any[]) {
  return Object.entries(kpiGroups)
    .filter(([kpiName, kpis]) => {
      // Only generate recommendations for KPIs with conflicts
      return conflicts.some((conflict) => conflict.metricName.toLowerCase() === kpis[0].Metric_Name.toLowerCase())
    })
    .map(([kpiName, kpis]) => {
      // For this demo, we'll use the most detailed definition as the recommended one
      const mostDetailedKpi = kpis.reduce((prev, current) =>
        current.Definition.length > prev.Definition.length ? current : prev,
      )

      return {
        metricName: mostDetailedKpi.Metric_Name,
        recommendedDefinition: mostDetailedKpi.Definition,
        sourceTeam: mostDetailedKpi.Team,
        alternativeNames: generateEquivalentTerms(mostDetailedKpi.Metric_Name),
        implementationSteps: [
          "Document the agreed definition in a central metrics dictionary",
          "Update dashboards and reports to reflect the unified definition",
          "Ensure all teams understand how this metric relates to their goals",
          "Review the definition quarterly to ensure continued alignment",
        ],
      }
    })
}

function generateEquivalentTerms(kpiName: string) {
  // This is a simplified implementation
  // In a real system, this would use NLP to find related terms
  const equivalentTermsMap: Record<string, string[]> = {
    "Conversion Rate": ["CR", "CVR", "Conversion %"],
    "Customer Acquisition Cost": ["CAC", "Cost per Acquisition", "CPA"],
    "Churn Rate": ["Attrition Rate", "Customer Churn", "Turnover Rate"],
    "Monthly Recurring Revenue": ["MRR", "Monthly Revenue"],
    "Customer Lifetime Value": ["CLV", "CLTV", "LTV"],
    "Net Promoter Score": ["NPS"],
    "Return on Investment": ["ROI", "Return on Ad Spend", "ROAS"],
  }

  // Find a case-insensitive match
  const key = Object.keys(equivalentTermsMap).find((key) => key.toLowerCase() === kpiName.toLowerCase())

  return key ? equivalentTermsMap[key] : []
}
