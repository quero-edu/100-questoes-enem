type AreaScore = { name: string; score: number; total: number }

export function FinalResult({
  totalScore,
  areas,
  wrongCount,
  onReview,
  onRestart,
}: {
  totalScore: number
  areas: AreaScore[]
  wrongCount: number
  onReview: () => void
  onRestart: () => void
}) {
  const best = areas.reduce((a, b) => (b.score > a.score ? b : a))
  const review = areas.reduce((a, b) => (b.score < a.score ? b : a))
  return (
    <main id="main" className="result page-center">
      <span className="eyebrow">Simulado concluído</span>
      <h1>Você chegou ao fim!</h1>
      <div className="result__hero">
        <strong>{totalScore}<small>/100 acertos</small></strong>
        <span>{totalScore}% de aproveitamento</span>
      </div>
      <section className="result__areas" aria-labelledby="result-areas">
        <h2 id="result-areas">Desempenho por área</h2>
        <div className="result__grid">
          {areas.map((area) => (
            <article key={area.name}>
              <span>{area.name}</span>
              <strong>{area.score}/{area.total}</strong>
              <div className="mini-progress" aria-label={`${Math.round(area.score / area.total * 100)}%`}>
                <span style={{ width: `${area.score / area.total * 100}%` }} />
              </div>
              <small>{Math.round(area.score / area.total * 100)}%</small>
            </article>
          ))}
        </div>
      </section>
      <div className="result__highlights">
        <p><span>Melhor desempenho</span><strong>{best.name}</strong></p>
        <p><span>Área para revisar</span><strong>{review.name}</strong></p>
      </div>
      <div className="result__actions">
        <button className="button button--primary" onClick={onReview} disabled={wrongCount === 0}>
          {wrongCount ? `Revisar ${wrongCount} ${wrongCount === 1 ? 'questão que errei' : 'questões que errei'}` : 'Você não errou nenhuma questão'}
        </button>
        <button className="button button--secondary" onClick={onRestart}>Refazer as 100 questões</button>
      </div>
    </main>
  )
}
