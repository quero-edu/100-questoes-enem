export function ProgressHeader({
  area,
  current,
  total,
  answered,
  areaProgress,
  onAreaSelect,
}: {
  area: string
  current: number
  total: number
  answered: number
  areaProgress: { id: number; name: string; answered: number }[]
  onAreaSelect: (areaId: number) => void
}) {
  const percentage = (answered / total) * 100
  return (
    <div className="progress-panel" aria-label={`Progresso: ${answered} de ${total} questões respondidas`}>
      <div className="progress-panel__meta">
        <div>
          <span className="eyebrow">{area}</span>
          <strong>Questão {current} de {total}</strong>
        </div>
        <details className="area-menu">
          <summary>Trocar área <span aria-hidden="true">⌄</span></summary>
          <div className="area-menu__popover">
            <span className="area-menu__title">Ir para uma área</span>
            {areaProgress.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={(event) => {
                  onAreaSelect(item.id)
                  event.currentTarget.closest('details')?.removeAttribute('open')
                }}
                aria-current={item.name === area ? 'true' : undefined}
              >
                <span><b>0{item.id}</b>{item.name}</span>
                <small>{item.answered}/25</small>
              </button>
            ))}
          </div>
        </details>
      </div>
      <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={answered}>
        <span style={{ width: `${percentage}%` }} />
      </div>
      <span className="progress-panel__answered">{answered} de {total} respondidas</span>
    </div>
  )
}
