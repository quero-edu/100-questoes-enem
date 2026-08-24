import type { Question } from '../types'

export function ProgressHeader({
  questions,
  current,
  answered,
  answeredNumbers,
  onQuestionSelect,
  onFinish,
}: {
  questions: Question[]
  current: number
  answered: number
  answeredNumbers: Set<number>
  onQuestionSelect: (number: number) => void
  onFinish: () => void
}) {
  const percentage = (answered / questions.length) * 100
  const currentQuestion = questions[current - 1]
  const areas = [1, 2, 3, 4].map((areaId) => {
    const areaQuestions = questions.filter((question) => question.areaId === areaId)
    return {
      id: areaId,
      name: areaQuestions[0].areaShort,
      range: `${String(areaQuestions[0].number).padStart(2, '0')}–${areaQuestions.at(-1)?.number}`,
      questions: areaQuestions,
      answered: areaQuestions.filter((question) => answeredNumbers.has(question.number)).length,
    }
  })

  return (
    <div className="progress-panel" aria-label={`Progresso: ${answered} de ${questions.length} questões respondidas`}>
      <div className="progress-panel__meta">
        <div>
          <span className="eyebrow">{currentQuestion.areaShort}</span>
          <strong>Questão {current} de {questions.length}</strong>
        </div>
        <div className="progress-panel__controls">
          <details className="question-menu">
            <summary>Ver questões <span aria-hidden="true">⌄</span></summary>
            <div className="question-menu__popover">
              <div className="question-menu__heading">
                <div>
                  <span className="question-menu__title">Navegador de questões</span>
                  <small>Escolha qualquer questão para estudar</small>
                </div>
                <span>{answered}/100</span>
              </div>
              <div className="question-menu__areas">
                {areas.map((area) => (
                  <section key={area.id} aria-labelledby={`question-area-${area.id}`}>
                    <header>
                      <div>
                        <h3 id={`question-area-${area.id}`}>{area.name}</h3>
                        <small>{area.range}</small>
                      </div>
                      <span>{area.answered}/25</span>
                    </header>
                    <div className="question-menu__grid">
                      {area.questions.map((question) => {
                        const isAnswered = answeredNumbers.has(question.number)
                        const isCurrent = question.number === current
                        return (
                          <button
                            type="button"
                            key={question.number}
                            data-answered={isAnswered ? 'true' : undefined}
                            aria-current={isCurrent ? 'page' : undefined}
                            aria-label={`Questão ${question.number}${isAnswered ? ', respondida' : ', pendente'}`}
                            onClick={(event) => {
                              onQuestionSelect(question.number)
                              event.currentTarget.closest('details')?.removeAttribute('open')
                            }}
                          >
                            <span>{String(question.number).padStart(2, '0')}</span>
                            {isAnswered && <b aria-hidden="true">✓</b>}
                          </button>
                        )
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </details>
          <button className="progress-panel__finish" type="button" onClick={onFinish}>Concluir por agora</button>
        </div>
      </div>
      <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}>
        <span style={{ width: `${percentage}%` }} />
      </div>
      <span className="progress-panel__answered">{answered} de {questions.length} respondidas</span>
    </div>
  )
}
