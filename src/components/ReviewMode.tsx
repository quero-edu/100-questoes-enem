import type { AnswerRecord, Question } from '../types'
import { RichText } from './RichText'

export function ReviewMode({
  questions,
  answers,
  onBack,
}: {
  questions: Question[]
  answers: Record<number, AnswerRecord>
  onBack: () => void
}) {
  return (
    <main id="main" className="review">
      <header className="review__header">
        <div>
          <span className="eyebrow">Hora de consolidar</span>
          <h1>Revise o que errou</h1>
          <p>{questions.length} {questions.length === 1 ? 'questão selecionada' : 'questões selecionadas'} para você entender e avançar.</p>
        </div>
        <button className="button button--secondary" onClick={onBack}>← Voltar ao resultado</button>
      </header>
      <div className="review__list">
        {questions.map((question) => {
          const answer = answers[question.number]
          return (
            <article className="review-card" key={question.number}>
              <div className="review-card__meta">
                <span>Questão {String(question.number).padStart(2, '0')}</span>
                <span>{question.areaShort}</span>
              </div>
              <h2>{question.theme}</h2>
              <RichText text={question.stem} className="review-card__stem" />
              <div className="review-card__answers">
                <p><span>Sua resposta</span><strong>{answer.selected} — {question.alternatives.find((item) => item.letter === answer.selected)?.text}</strong></p>
                <p><span>Resposta correta</span><strong>{question.answer} — {question.alternatives.find((item) => item.letter === question.answer)?.text}</strong></p>
              </div>
              <div className="review-card__comment">
                <span className="question__label">Comentário</span>
                <RichText text={question.explanation} />
              </div>
            </article>
          )
        })}
      </div>
      <button className="button button--secondary review__back" onClick={onBack}>← Voltar ao resultado</button>
    </main>
  )
}
