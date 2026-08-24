type AreaScore = { id: number; name: string; score: number; answered: number; total: number }

const links = {
  revista: 'https://querobolsa.com.br/revista/assunto/enem',
  queroBolsa: 'https://querobolsa.com.br/?utm_source=querobolsa&utm_medium=whatsapp&utm_campaign=comunidade-preparadao-26_guia-questoes-comentadas-enem',
  instagram: 'https://www.instagram.com/preparadao.enem/',
  youtube: 'https://www.youtube.com/@querobolsa',
  tiktok: 'https://www.tiktok.com/@QUERO.BOLSA',
}

function SocialIcon({ name }: { name: 'instagram' | 'youtube' | 'tiktok' }) {
  if (name === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" className="social-icon__dot" />
      </svg>
    )
  }

  if (name === 'youtube') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M22 12c0 2.4-.3 4.4-.7 5.4-.3.8-.9 1.4-1.7 1.7-1.5.4-4.3.7-7.6.7s-6.1-.3-7.6-.7c-.8-.3-1.4-.9-1.7-1.7C2.3 16.4 2 14.4 2 12s.3-4.4.7-5.4c.3-.8.9-1.4 1.7-1.7C5.9 4.5 8.7 4.2 12 4.2s6.1.3 7.6.7c.8.3 1.4.9 1.7 1.7.4 1 .7 3 .7 5.4Z" />
        <path d="m10 8.7 5.3 3.3-5.3 3.3V8.7Z" className="social-icon__cutout" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M15.4 3c.4 2.2 1.7 3.6 3.8 3.8v3.1a8.6 8.6 0 0 1-3.8-1.1v6.5a5.8 5.8 0 1 1-5-5.7v3.2a2.6 2.6 0 1 0 1.8 2.5V3h3.2Z" />
    </svg>
  )
}

export function FinalResult({
  totalScore,
  answeredCount,
  areas,
  wrongCount,
  onReview,
  onRestart,
  onContinue,
}: {
  totalScore: number
  answeredCount: number
  areas: AreaScore[]
  wrongCount: number
  onReview: () => void
  onRestart: () => void
  onContinue: () => void
}) {
  const isComplete = answeredCount === 100
  const percentage = answeredCount ? Math.round((totalScore / answeredCount) * 100) : 0
  const remainingCount = 100 - answeredCount
  const answeredAreas = areas.filter((area) => area.answered > 0)
  const best = answeredAreas.reduce<AreaScore | null>((current, area) => {
    if (!current) return area
    return area.score / area.answered > current.score / current.answered ? area : current
  }, null)
  const review = answeredAreas.reduce<AreaScore | null>((current, area) => {
    if (!current) return area
    return area.score / area.answered < current.score / current.answered ? area : current
  }, null)

  return (
    <main id="main" className="result page-center">
      <span className="eyebrow">{isComplete ? '100 questões concluídas' : 'Estudo salvo'}</span>
      <h1>{isComplete ? 'Parabéns! Você concluiu as 100 questões.' : 'Você concluiu seu estudo por agora!'}</h1>
      <div className="result__hero">
        <strong>
          {isComplete ? `${totalScore}/100` : totalScore}
          <small>
            {isComplete
              ? 'acertos'
              : `${totalScore === 1 ? 'acerto' : 'acertos'} em ${answeredCount} ${answeredCount === 1 ? 'questão respondida' : 'questões respondidas'}`}
          </small>
        </strong>
        <span>{percentage}% de aproveitamento</span>
      </div>
      <div className="result__study-progress" aria-label="Progresso geral do material">
        <p><span>Respondidas</span><strong>{answeredCount} de 100</strong></p>
        <p><span>Restantes</span><strong>{remainingCount}</strong></p>
      </div>
      <section className="result__areas" aria-labelledby="result-areas">
        <h2 id="result-areas">Desempenho por área</h2>
        <div className="result__grid">
          {areas.map((area) => {
            const areaPercentage = area.answered ? Math.round((area.score / area.answered) * 100) : null
            return (
            <article key={area.name} data-empty={area.answered === 0 ? 'true' : undefined}>
              <span>{area.name}</span>
              {areaPercentage === null ? (
                <strong className="result__empty-area">Ainda não respondida</strong>
              ) : (
                <>
                  <strong>{area.score} {area.score === 1 ? 'acerto' : 'acertos'}</strong>
                  <small>em {area.answered} {area.answered === 1 ? 'respondida' : 'respondidas'}</small>
                  <div className="mini-progress" aria-label={`${areaPercentage}% de aproveitamento`}>
                    <span style={{ width: `${areaPercentage}%` }} />
                  </div>
                  <small className="result__area-percentage">{areaPercentage}%</small>
                </>
              )}
            </article>
          )})}
        </div>
      </section>
      {best && review && (
        <div className="result__highlights">
          <p><span>Melhor desempenho</span><strong>{best.name}</strong></p>
          <p><span>Área para revisar</span><strong>{review.name}</strong></p>
        </div>
      )}
      <div className="result__actions">
        {!isComplete && (
          <button className="button button--primary" onClick={onContinue}>Continuar respondendo <span aria-hidden="true">→</span></button>
        )}
        <button className={`button ${isComplete ? 'button--primary' : 'button--secondary'}`} onClick={onReview} disabled={wrongCount === 0}>
          {wrongCount ? `Revisar ${wrongCount} ${wrongCount === 1 ? 'questão que errei' : 'questões que errei'}` : 'Você não errou nenhuma questão'}
        </button>
        {isComplete && <button className="button button--secondary" onClick={onRestart}>Refazer as 100 questões</button>}
      </div>

      <section className="result__closing" aria-labelledby="closing-title">
        <span className="eyebrow">Seu próximo passo</span>
        <h2 id="closing-title">Continue sua jornada com a Quero Bolsa</h2>
        <p>Conte com a gente para seguir aprendendo e encontrar as melhores oportunidades para o seu futuro.</p>

        <div className="result__resources" aria-label="Conteúdos e oportunidades da Quero Bolsa">
          <a href={links.revista} target="_blank" rel="noopener noreferrer" aria-label="Acessar a Revista Quero em uma nova aba">
            <span><small>Conteúdos para seus estudos</small><strong>Revista Quero</strong></span>
            <b aria-hidden="true">↗</b>
          </a>
          <a href={links.queroBolsa} target="_blank" rel="noopener noreferrer" aria-label="Acessar o site Quero Bolsa em uma nova aba">
            <span><small>Bolsas de estudo para você</small><strong>Site Quero Bolsa</strong></span>
            <b aria-hidden="true">↗</b>
          </a>
        </div>

        <div className="result__social">
          <h3>Acompanhe a Quero Bolsa e o Preparadão nas redes sociais</h3>
          <div className="result__social-links">
            <a href={links.instagram} target="_blank" rel="noopener noreferrer" aria-label="Acompanhar o Preparadão no Instagram em uma nova aba">
              <SocialIcon name="instagram" />
              <span>Instagram</span>
            </a>
            <a href={links.tiktok} target="_blank" rel="noopener noreferrer" aria-label="Acompanhar a Quero Bolsa no TikTok em uma nova aba">
              <SocialIcon name="tiktok" />
              <span>TikTok</span>
            </a>
            <a href={links.youtube} target="_blank" rel="noopener noreferrer" aria-label="Acompanhar a Quero Bolsa no YouTube em uma nova aba">
              <SocialIcon name="youtube" />
              <span>YouTube</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
