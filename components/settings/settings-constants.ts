export const EXECUTION_MODES = [
  { id: "autonomous", label: "Autonomous", description: "Execute directly with reasonable assumptions" },
  { id: "collaborative", label: "Collaborative", description: "Ask clarifying questions when needed" },
  { id: "guided", label: "Guided", description: "Show plans and ask for approval before executing" },
]

export const COMMUNICATION_STYLES = [
  { id: "concise", label: "Concise", description: "Brief, direct responses" },
  { id: "balanced", label: "Balanced", description: "Clear with context" },
  { id: "detailed", label: "Detailed", description: "Thorough explanations" },
]

export const TASK_PLANNING_OPTIONS = [
  { id: "auto", label: "Auto", description: "Show task breakdowns for complex requests only" },
  { id: "always", label: "Always", description: "Always show task planning" },
  { id: "never", label: "Never", description: "Execute directly without showing plans" },
]

export const TASK_COMPLEXITY = [
  { id: "auto", label: "Auto", description: "Show task breakdowns for complex requests only" },
  { id: "always", label: "Always", description: "Always show task planning" },
  { id: "never", label: "Never", description: "Execute directly without showing plans" },
]

export const QUESTION_FREQUENCY = [
  { id: "none", label: "None", description: "Never ask questions, make reasonable assumptions" },
  { id: "minimal", label: "Minimal", description: "Only ask critical questions to avoid major mistakes" },
  { id: "moderate", label: "Moderate", description: "Ask questions when helpful for better results" },
  { id: "thorough", label: "Thorough", description: "Ask detailed questions to fully understand needs" },
]

export const QUESTION_COUNT_LABELS = [
  { value: 0, label: "None" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 5, label: "5+" },
]
