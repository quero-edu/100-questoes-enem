import { BrandHeader } from './BrandHeader'

const areas = [
  ['01—25', 'Linguagens'],
  ['26—50', 'Ciências Humanas'],
  ['51—75', 'Ciências da Natureza'],
  ['76—100', 'Matemática'],
]

export function Home({
  onContinue,
  onBrowse,
  answeredCount,
}: {
  onContinue: () => void
  onBrowse: () => void
  answeredCount: number
}) {
  const hasProgress = answeredCount > 0

  return (
    <main id="main" className="home">
      <div className="home__shell">
        <BrandHeader />
        <section className="hero">
          <div className="hero__copy">
            <span className="eyebrow">Seu próximo passo começa aqui</span>
            <h1>
              <em>100 Questões</em>
              <span>ENEM</span>
              <span>Comentadas</span>
            </h1>
            <p>Questões no estilo clássico do ENEM, organizadas por área. Cada questão traz alternativas, gabarito e explicação simples e direta.</p>
            {hasProgress && (
              <div className="hero__saved-progress">
                <strong>Você já começou este material.</strong>
                <span>{answeredCount} de 100 questões respondidas</span>
              </div>
            )}
            <div className="hero__actions">
              <button className="button button--primary button--large" onClick={onContinue}>
                {hasProgress ? 'Continuar de onde parei' : 'Começar'} <span aria-hidden="true">→</span>
              </button>
              {hasProgress && (
                <button className="button button--secondary button--large" onClick={onBrowse}>Ver questões</button>
              )}
            </div>
            <div className="hero__facts" aria-label="Resumo da experiência">
              <span><strong>100</strong> questões</span>
              <span><strong>4</strong> áreas</span>
              <span><strong>Feedback</strong> imediato</span>
              <span><strong>100%</strong> comentadas</span>
            </div>
          </div>
        </section>
        <section className="area-intro" aria-labelledby="areas-title">
          <div>
            <span className="eyebrow">A jornada completa</span>
            <h2 id="areas-title">Quatro áreas. Um objetivo.</h2>
          </div>
          <ol className="area-list">
            {areas.map(([range, name], index) => (
              <li key={name}>
                <span className="area-list__index">0{index + 1}</span>
                <strong>{name}</strong>
                <span>{range}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  )
}
