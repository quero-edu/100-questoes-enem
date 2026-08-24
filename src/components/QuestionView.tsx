import type { Question } from '../types'
import { RichText } from './RichText'

type Props = {
  question: Question
  selected: string | null
  submitted: boolean
  onSelect: (letter: string) => void
  onSubmit: () => void
  onNext: () => void
  onPrevious: () => void
  canGoPrevious: boolean
  allAnswered: boolean
}

export function QuestionView({ question, selected, submitted, onSelect, onSubmit, onNext, onPrevious, canGoPrevious, allAnswered }: Props) {
  const isCorrect = selected === question.answer

  return (
    <article className="question" aria-labelledby="question-title">
      <header className="question__header">
        <span className="question__number" aria-hidden="true">{String(question.number).padStart(2, '0')}</span>
        <div>
          <span className="question__label">Tema</span>
          <h1 id="question-title">{question.theme}</h1>
        </div>
      </header>

      <RichText text={question.stem} className="question__stem" />

      <fieldset className="alternatives" disabled={submitted}>
        <legend className="sr-only">Escolha uma alternativa</legend>
        {question.alternatives.map((alternative) => {
          const isSelected = selected === alternative.letter
          const isAnswer = question.answer === alternative.letter
          const state = submitted
            ? isAnswer
              ? 'correct'
              : isSelected
                ? 'incorrect'
                : 'disabled'
            : isSelected
              ? 'selected'
              : 'default'
          return (
            <label className="alternative" data-state={state} key={alternative.letter}>
              <input
                type="radio"
                name={`question-${question.number}`}
                value={alternative.letter}
                checked={isSelected}
                onChange={() => onSelect(alternative.letter)}
              />
              <span className="alternative__letter">{alternative.letter}</span>
              <span className="alternative__text">{alternative.text.replaceAll('\\_', '_')}</span>
              {submitted && isAnswer && <span className="alternative__status">✓ Correta</span>}
              {submitted && isSelected && !isAnswer && <span className="alternative__status">× Sua resposta</span>}
            </label>
          )
        })}
      </fieldset>

      {submitted && selected && (
        <section className={`feedback ${isCorrect ? 'feedback--correct' : 'feedback--incorrect'}`} aria-live="polite">
          <div className="feedback__heading">
            <span className="feedback__icon" aria-hidden="true">{isCorrect ? '✓' : '!'}</span>
            <div>
              <h2>{isCorrect ? 'Você acertou!' : 'Não foi dessa vez.'}</h2>
              {!isCorrect && (
                <p>
                  <strong>Sua resposta:</strong> {selected} &nbsp;·&nbsp; <strong>Resposta correta:</strong> {question.answer}
                </p>
              )}
              {isCorrect && <p>Resposta correta: alternativa {question.answer}.</p>}
            </div>
          </div>
          <div className="feedback__comment">
            <span className="question__label">Comentário</span>
            <RichText text={question.explanation} />
          </div>
        </section>
      )}

      <div className="question__actions">
        <button className="button button--secondary question__previous" disabled={!canGoPrevious} onClick={onPrevious}>
          <span aria-hidden="true">←</span> Questão anterior
        </button>
        {!submitted ? (
          <button className="button button--primary" disabled={!selected} onClick={onSubmit}>
            Responder
          </button>
        ) : (
          <button className="button button--primary" onClick={onNext}>
            {question.number === 100 && allAnswered ? 'Ver meu resultado' : 'Próxima questão'} <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </article>
  )
}
