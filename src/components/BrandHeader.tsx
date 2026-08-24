export function BrandHeader({ compact = false, onHome }: { compact?: boolean; onHome?: () => void }) {
  return (
    <header className={`brand-header ${compact ? 'brand-header--compact' : ''}`}>
      <button
        className="brand-header__home"
        type="button"
        onClick={onHome ?? (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
        aria-label="Voltar para a tela inicial"
      >
        <img
          src="/brand/Logo-Preparadao-Horizontal-03.svg"
          alt="Preparadão"
          className="brand-header__preparadao"
        />
      </button>
      <span className="brand-header__divider" aria-hidden="true" />
      <img
        src="/brand/logo-quero-bolsa.svg"
        alt="Quero Bolsa"
        className="brand-header__quero"
      />
    </header>
  )
}
