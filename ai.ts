// lib/ai.ts — OpenAI integration for schedule analysis and auto-scheduling

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface EventData {
  title: string
  startTime: string
  endTime: string
  category: string
  priority: string
  description?: string
}

export interface GoalData {
  title: string
  type: string
  category: string
  hoursPerWeek?: number
  targetDate?: string
}

export interface HabitData {
  name: string
  frequency: string
  timeOfDay?: string
  duration: number
}

export interface AnalysisResult {
  productivityScore: number
  summary: string
  suggestions: string[]
  timeBreakdown: Record<string, number>
  overloadWarning: boolean
  balanceScore: number
  focusBlocks: string[]
}

export interface AutoScheduleResult {
  scheduledEvents: {
    title: string
    startTime: string
    endTime: string
    category: string
    priority: string
  }[]
  message: string
}

/**
 * Analyze user's schedule with AI and generate productivity insights
 * Uses GPT-4 to identify patterns, inefficiencies, and opportunities
 */
export async function analyzeSchedule(
  events: EventData[],
  goals: GoalData[],
  habits: HabitData[],
  weekStart: string
): Promise<AnalysisResult> {
  const prompt = `You are an expert productivity coach and scheduling analyst. Analyze this user's weekly schedule and provide actionable insights.

WEEK STARTING: ${weekStart}

SCHEDULED EVENTS:
${JSON.stringify(events, null, 2)}

USER GOALS:
${JSON.stringify(goals, null, 2)}

DAILY HABITS:
${JSON.stringify(habits, null, 2)}

Analyze the schedule for:
1. Time distribution across categories (work, personal, health, etc.)
2. Productivity patterns (are high-focus tasks scheduled at peak times?)
3. Schedule overload (back-to-back meetings, no recovery time)
4. Goal alignment (are habits/events supporting stated goals?)
5. Work-life balance
6. Missing time blocks (no exercise, no deep work, etc.)

Respond ONLY with a valid JSON object in this exact format:
{
  "productivityScore": <number 0-100>,
  "summary": "<2-3 sentence overview of the week>",
  "suggestions": [
    "<specific actionable suggestion 1>",
    "<specific actionable suggestion 2>",
    "<specific actionable suggestion 3>",
    "<specific actionable suggestion 4>",
    "<specific actionable suggestion 5>"
  ],
  "timeBreakdown": {
    "work": <hours as number>,
    "personal": <hours as number>,
    "health": <hours as number>,
    "social": <hours as number>,
    "learning": <hours as number>,
    "unscheduled": <hours as number>
  },
  "overloadWarning": <true or false>,
  "balanceScore": <number 0-100>,
  "focusBlocks": [
    "<recommended focus block time>",
    "<recommended focus block time>"
  ]
}`

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 1000,
  })

  const content = response.choices[0].message.content || '{}'
  return JSON.parse(content) as AnalysisResult
}

/**
 * Auto-schedule a goal across the week using AI
 * Finds optimal time slots avoiding conflicts
 */
export async function autoScheduleGoal(
  goalTitle: string,
  hoursNeeded: number,
  existingEvents: EventData[],
  preferences: {
    preferredTimes?: string[]
    avoidDays?: string[]
    sessionDuration?: number
  },
  weekStart: string
): Promise<AutoScheduleResult> {
  const prompt = `You are an intelligent scheduling assistant. Auto-schedule a goal into a user's calendar.

GOAL: "${goalTitle}"
HOURS NEEDED THIS WEEK: ${hoursNeeded}
WEEK STARTING: ${weekStart}
PREFERRED SESSION LENGTH: ${preferences.sessionDuration || 90} minutes
PREFERRED TIMES: ${preferences.preferredTimes?.join(', ') || 'morning and afternoon'}

EXISTING EVENTS (avoid conflicts):
${JSON.stringify(existingEvents, null, 2)}

Create a schedule that:
1. Achieves the ${hoursNeeded} hours goal
2. Avoids all existing event times
3. Places sessions at optimal times (mornings for focus work)
4. Spreads sessions across multiple days
5. Includes buffer time between sessions

Respond ONLY with a valid JSON object:
{
  "scheduledEvents": [
    {
      "title": "<goal title - Session N>",
      "startTime": "<ISO 8601 datetime>",
      "endTime": "<ISO 8601 datetime>",
      "category": "learning",
      "priority": "high"
    }
  ],
  "message": "<brief explanation of the schedule created>"
}`

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.5,
    max_tokens: 1500,
  })

  const content = response.choices[0].message.content || '{}'
  return JSON.parse(content) as AutoScheduleResult
}

/**
 * Generate a quick AI suggestion for a single event
 * Used when user adds a new event
 */
export async function getEventSuggestion(
  event: EventData,
  existingEvents: EventData[]
): Promise<string> {
  const prompt = `As a productivity coach, give ONE concise insight (max 2 sentences) about this new event and how it fits into the user's schedule.

NEW EVENT: ${JSON.stringify(event)}
CONTEXT (other events same day): ${JSON.stringify(
    existingEvents.filter((e) => e.startTime.split('T')[0] === event.startTime.split('T')[0])
  )}

Be specific and actionable. Focus on timing, energy levels, or potential conflicts.`

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 100,
  })

  return response.choices[0].message.content || 'Event added successfully.'
}
