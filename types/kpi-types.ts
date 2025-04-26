export interface TeamKpiDefinition {
  team: string
  kpiName: string
  definition: string
  formula?: string
  dataSource?: string
  frequency?: string
  owner?: string
  target?: string
}

export interface KpiSummary {
  kpiName: string
  teams: string[]
  alignmentStatus: "Aligned" | "Misaligned" | "Partially Aligned"
  definitions: {
    team: string
    definition: string
    formula?: string
  }[]
}

export interface KpiConflict {
  kpiName: string
  description: string
  details: {
    team: string
    definition: string
  }[]
  impact: string
}

export interface KpiTranslation {
  kpiName: string
  teamTranslations: {
    team: string
    meaning: string
    equivalentTerms?: string[]
  }[]
}

export interface KpiRecommendation {
  kpiName: string
  definition: string
  formula?: string
  alternativeNames?: string[]
  rationale?: string
  implementationSteps?: string[]
}

export interface KpiAnalysisResult {
  summaries: KpiSummary[]
  conflicts: KpiConflict[]
  translations: KpiTranslation[]
  recommendations: KpiRecommendation[]
}

export interface KpiData {
  Team: string
  Metric_Name: string
  Definition: string
}

export interface FunnelStage {
  stage: "Awareness" | "Consideration" | "Conversion" | "Retention" | "Unknown"
  description: string
}

export interface TeamAlignmentScore {
  team: string
  score: number
  overlaps: MetricOverlap[]
  conflicts: MetricConflict[]
}

export interface MetricOverlap {
  team1: string
  metric1: string
  team2: string
  metric2: string
  commonTerms: string[]
  severity: number
}

export interface MetricConflict {
  concept: string
  team1: string
  metric1: string
  definition1: string
  team2: string
  metric2: string
  definition2: string
}
