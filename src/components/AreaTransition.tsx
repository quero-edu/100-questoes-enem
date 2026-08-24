export function AreaTransition({
  area,
  score,
  nextArea,
  onContinue,
}: {
  area: string
  score: number
  nextArea: string
  onContinue: () => void
}) {
  const percentage = Math.round((score / 25) * 100)
  return (
    <main id="main" className="milestone page-center">
      <span className="milestone__mark" aria-hidden="true">✓</span>
      <span className="eyebrow">Etapa concluída</span>
      <h1>{area} concluída</h1>
      <p>Você avançou mais 25 questões. Respire, confira seu resultado e siga quando estiver pronto.</p>
      <div className="milestone__score">
        <strong>{score}<small>/25 acertos</small></strong>
        <span>{percentage}% de aproveitamento</span>
      </div>
      <div className="milestone__next">
        <span>Próxima área</span>
        <strong>{nextArea}</strong>
      </div>
      <button className="button button--primary button--large" onClick={onContinue}>Continuar <span aria-hidden="true">→</span></button>
    </main>
  )
}
