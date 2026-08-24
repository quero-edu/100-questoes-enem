import { useEffect, useMemo, useState } from 'react'
import rawQuestions from './data/questions.json'
import type { AnswerRecord, Question, Screen } from './types'
import { BrandHeader } from './components/BrandHeader'
import { Home } from './components/Home'
import { ProgressHeader } from './components/ProgressHeader'
import { QuestionView } from './components/QuestionView'
import { AreaTransition } from './components/AreaTransition'
import { FinalResult } from './components/FinalResult'
import { ReviewMode } from './components/ReviewMode'

const questions = rawQuestions as Question[]

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<Record<number, AnswerRecord>>({})
  const current = questions[currentIndex]

  useEffect(() => {
    if (screen !== 'home') window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [screen, currentIndex])

  const areaScores = useMemo(() => {
    return [1, 2, 3, 4].map((areaId) => {
      const areaQuestions = questions.filter((question) => question.areaId === areaId)
      return {
        name: areaQuestions[0].areaShort,
        score: areaQuestions.filter((question) => answers[question.number]?.correct).length,
        total: areaQuestions.length,
      }
    })
  }, [answers])

  const totalScore = Object.values(answers).filter((answer) => answer.correct).length
  const answeredCount = Object.keys(answers).length
  const wrongQuestions = questions.filter((question) => answers[question.number] && !answers[question.number].correct)
  const areaProgress = useMemo(() => {
    return [1, 2, 3, 4].map((areaId) => {
      const areaQuestions = questions.filter((question) => question.areaId === areaId)
      return {
        id: areaId,
        name: areaQuestions[0].areaShort,
        answered: areaQuestions.filter((question) => answers[question.number]).length,
      }
    })
  }, [answers])

  function start() {
    setScreen('quiz')
  }

  function goHome() {
    setScreen('home')
  }

  function goToQuestion(index: number) {
    const target = questions[index]
    const savedAnswer = answers[target.number]
    setCurrentIndex(index)
    setSelected(savedAnswer?.selected ?? null)
    setSubmitted(Boolean(savedAnswer))
    setScreen('quiz')
  }

  function goToArea(areaId: number) {
    const firstInArea = questions.findIndex((question) => question.areaId === areaId)
    const firstUnanswered = questions.findIndex((question) => question.areaId === areaId && !answers[question.number])
    goToQuestion(firstUnanswered >= 0 ? firstUnanswered : firstInArea)
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
    if (!submitted) return
    if (current.number === 100) {
      if (answeredCount === questions.length) {
        setScreen('result')
      } else {
        const firstUnanswered = questions.findIndex((question) => !answers[question.number])
        goToQuestion(firstUnanswered)
      }
      return
    }
    if ([25, 50, 75].includes(current.number)) {
      const nextAreaHasProgress = questions.some(
        (question) => question.areaId === current.areaId + 1 && answers[question.number],
      )
      if (nextAreaHasProgress) goToQuestion(currentIndex + 1)
      else setScreen('transition')
      return
    }
    goToQuestion(currentIndex + 1)
  }

  function continueArea() {
    goToQuestion(currentIndex + 1)
  }

  function restart() {
    setAnswers({})
    setCurrentIndex(0)
    setSelected(null)
    setSubmitted(false)
    setScreen('quiz')
  }

  if (screen === 'home') return <Home onStart={start} answeredCount={answeredCount} />

  if (screen === 'transition') {
    const areaResult = areaScores[current.areaId - 1]
    return (
      <div className="app-shell app-shell--dark">
        <BrandHeader compact onHome={goHome} />
        <AreaTransition
          area={current.areaShort}
          score={areaResult.score}
          nextArea={questions[currentIndex + 1].areaShort}
          onContinue={continueArea}
        />
      </div>
    )
  }

  if (screen === 'result') {
    return (
      <div className="app-shell app-shell--result">
        <BrandHeader compact onHome={goHome} />
        <FinalResult totalScore={totalScore} areas={areaScores} wrongCount={wrongQuestions.length} onReview={() => setScreen('review')} onRestart={restart} />
      </div>
    )
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
          area={current.areaShort}
          current={current.number}
          total={questions.length}
          answered={answeredCount}
          areaProgress={areaProgress}
          onAreaSelect={goToArea}
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
          allAnswered={answeredCount === questions.length}
        />
      </main>
    </div>
  )
}

export default App
