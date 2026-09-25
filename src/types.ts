export type Alternative = { letter: string; text: string }

export type Question = {
  number: number
  areaId: number
  area: string
  areaShort: string
  theme: string
  stem: string
  alternatives: Alternative[]
  answer: string
  explanation: string
}

export type AnswerRecord = {
  selected: string
  correct: boolean
}

export type Screen = 'home' | 'lead' | 'quiz' | 'result' | 'review'
