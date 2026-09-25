import { useEffect, useMemo, useState } from 'react'
import rawQuestions from './data/questions.json'
import type { AnswerRecord, Question, Screen } from './types'
import { BrandHeader } from './components/BrandHeader'
import { Home } from './components/Home'
import { ProgressHeader } from './components/ProgressHeader'
import { QuestionView } from './components/QuestionView'
import { FinalResult } from './components/FinalResult'
import { ReviewMode } from './components/ReviewMode'
import { LeadCapture, type LeadData } from './components/LeadCapture'

const questions = rawQuestions as Question[]
const STORAGE_KEY = 'preparadao-enem-progress-v1'
const LEAD_STORAGE_KEY = 'preparadao-enem-lead-v2'

type SavedProgress = {
  answers: Record<number, AnswerRecord>
  currentIndex: number
}

function readProgress(): SavedProgress {
  if (typeof window === 'undefined') return { answers: {}, currentIndex: 0 }

  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '') as Partial<SavedProgress>
    const currentIndex = Number.isInteger(saved.currentIndex) && Number(saved.currentIndex) >= 0 && Number(saved.currentIndex) < questions.length
      ? Number(saved.currentIndex)
      : 0
    const answers = saved.answers && typeof saved.answers === 'object' ? saved.answers : {}
    return { answers, currentIndex }
  } catch {
    return { answers: {}, currentIndex: 0 }
  }
}

function hasSavedLead() {
  if (typeof window === 'undefined') return false

  try {
    const saved = JSON.parse(window.localStorage.getItem(LEAD_STORAGE_KEY) ?? '') as Partial<LeadData>
    return Boolean(saved.name && saved.age && saved.objective && saved.email && saved.phone)
  } catch {
    return false
  }
}

function App() {
  const [initialProgress] = useState(readProgress)
  const [screen, setScreen] = useState<Screen>('home')
  const [currentIndex, setCurrentIndex] = useState(initialProgress.currentIndex)
  const initialAnswer = initialProgress.answers[questions[initialProgress.currentIndex].number]
  const [selected, setSelected] = useState<string | null>(initialAnswer?.selected ?? null)
  const [submitted, setSubmitted] = useState(Boolean(initialAnswer))
  const [answers, setAnswers] = useState<Record<number, AnswerRecord>>(initialProgress.answers)
  const [leadCaptured, setLeadCaptured] = useState(hasSavedLead)
  const [leadDestination, setLeadDestination] = useState(initialProgress.currentIndex)
  const current = questions[currentIndex]

  useEffect(() => {
    if (screen !== 'home') window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [screen, currentIndex])

  const areaScores = useMemo(() => {
    return [1, 2, 3, 4].map((areaId) => {
      const areaQuestions = questions.filter((question) => question.areaId === areaId)
      return {
        id: areaId,
        name: areaQuestions[0].areaShort,
        score: areaQuestions.filter((question) => answers[question.number]?.correct).length,
        answered: areaQuestions.filter((question) => answers[question.number]).length,
        total: areaQuestions.length,
      }
    })
  }, [answers])

  const totalScore = Object.values(answers).filter((answer) => answer.correct).length
  const answeredCount = Object.keys(answers).length
  const wrongQuestions = questions.filter((question) => answers[question.number] && !answers[question.number].correct)
  const answeredNumbers = useMemo(() => new Set(Object.keys(answers).map(Number)), [answers])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: 1,
      answers,
      currentIndex,
      lastQuestion: currentIndex + 1,
      answeredCount,
      areaProgress: areaScores.map(({ id, name, answered }) => ({ id, name, answered })),
    }))
  }, [answers, currentIndex, answeredCount, areaScores])

  function goToQuestion(index: number) {
    const target = questions[index]
    if (!target) return
    const savedAnswer = answers[target.number]
    setCurrentIndex(index)
    setSelected(savedAnswer?.selected ?? null)
    setSubmitted(Boolean(savedAnswer))
    setScreen('quiz')
  }

  function requestQuestionAccess(index: number) {
    if (leadCaptured) {
      goToQuestion(index)
      return
    }

    setLeadDestination(index)
    setScreen('lead')
  }

  function continueFromHome() {
    requestQuestionAccess(currentIndex)
  }

  function browseQuestions() {
    requestQuestionAccess(0)
  }

  function goHome() {
    setScreen('home')
  }

  function completeLeadCapture(lead: LeadData) {
    window.localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify({
      ...lead,
      version: 1,
      capturedAt: new Date().toISOString(),
    }))
    setLeadCaptured(true)
    goToQuestion(leadDestination)
  }

  function submitAnswer() {
    if (!selected || submitted) return
    setAnswers((previous) => ({
      ...previous,
      [current.number]: { selected, correct: selected === current.answer },
    }))
    setSubmitted(true)
  }

  function next() {
    if (currentIndex < questions.length - 1) goToQuestion(currentIndex + 1)
  }

  function showResult() {
    setScreen('result')
  }

  function continueAnswering() {
    const firstUnanswered = questions.findIndex((question) => !answers[question.number])
    goToQuestion(firstUnanswered >= 0 ? firstUnanswered : currentIndex)
  }

  function restart() {
    window.localStorage.removeItem(STORAGE_KEY)
    setAnswers({})
    setCurrentIndex(0)
    setSelected(null)
    setSubmitted(false)
    setScreen('quiz')
  }

  if (screen === 'home') {
    return (
      <Home
        onContinue={continueFromHome}
        onBrowse={browseQuestions}
        answeredCount={answeredCount}
      />
    )
  }

  if (screen === 'result') {
    return (
      <div className="app-shell app-shell--result">
        <BrandHeader compact onHome={goHome} />
        <FinalResult
          totalScore={totalScore}
          answeredCount={answeredCount}
          areas={areaScores}
          wrongCount={wrongQuestions.length}
          onReview={() => setScreen('review')}
          onRestart={restart}
          onContinue={continueAnswering}
        />
      </div>
    )
  }

  if (screen === 'lead') {
    return <LeadCapture onComplete={completeLeadCapture} onBack={goHome} />
  }

  if (screen === 'review') {
    return (
      <div className="app-shell app-shell--review">
        <BrandHeader compact onHome={goHome} />
        <ReviewMode questions={wrongQuestions} answers={answers} onBack={() => setScreen('result')} />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <BrandHeader compact onHome={goHome} />
      <main id="main" className="quiz-layout">
        <ProgressHeader
          questions={questions}
          current={current.number}
          answered={answeredCount}
          answeredNumbers={answeredNumbers}
          onQuestionSelect={(number) => goToQuestion(number - 1)}
          onFinish={showResult}
        />
        <QuestionView
          question={current}
          selected={selected}
          submitted={submitted}
          onSelect={setSelected}
          onSubmit={submitAnswer}
          onNext={next}
          onPrevious={() => goToQuestion(currentIndex - 1)}
          canGoPrevious={currentIndex > 0}
          canGoNext={currentIndex < questions.length - 1}
        />
      </main>
    </div>
  )
}

export default App
