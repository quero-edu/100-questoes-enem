import { useState, type FormEvent } from 'react'
import { BrandHeader } from './BrandHeader'

export type LeadData = {
  name: string
  age: number
  objective: string
  email: string
  phone: string
}

const objectives = [
  'Quero testar como estou para o ENEM',
  'Quero melhorar minha nota',
  'Quero descobrir o que preciso estudar mais',
  'Quero entrar na faculdade',
  'Quero encontrar uma faculdade mais acessível',
  'Ainda estou decidindo',
]

const PHONE_ERROR = 'Digite um telefone com DDD válido.'

// A regra do DDD vira validação nativa do input: assim o navegador bloqueia o envio
// e o evento `submit` (capturado pelo autoTrack do Montilla) só dispara com lead válido.
function validatePhone(input: HTMLInputElement) {
  const digits = input.value.replace(/\D/g, '')
  const invalid = input.value.trim() !== '' && (digits.length < 10 || digits.length > 11)
  input.setCustomValidity(invalid ? PHONE_ERROR : '')
}

export function LeadCapture({
  onComplete,
  onBack,
}: {
  onComplete: (lead: LeadData) => void
  onBack: () => void
}) {
  const [phoneError, setPhoneError] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    onComplete({
      name: String(data.get('name') ?? '').trim(),
      age: Number(data.get('age')),
      objective: String(data.get('objective') ?? ''),
      email: String(data.get('email') ?? '').trim().toLowerCase(),
      phone: String(data.get('phone') ?? '').trim(),
    })
  }

  return (
    <div className="app-shell app-shell--lead">
      <BrandHeader compact onHome={onBack} />
      <main id="main" className="lead-capture">
        <section className="lead-capture__intro">
          <span className="eyebrow">Antes de começar</span>
          <h1>Bora descobrir onde você quer chegar?</h1>
          <p>Conta rapidinho sobre você para liberar as 100 questões comentadas do ENEM.</p>
          <div className="lead-capture__benefit">
            <strong>Seu estudo começa aqui</strong>
            <span>Questões por área, gabarito e explicações simples e diretas.</span>
          </div>
        </section>

        <form id="lead-form" className="lead-form" data-montilla-form-type="lead" onSubmit={submit}>
          <div className="lead-form__heading">
            <div>
              <span>Só falta isso para começar</span>
              <p>Preencha seus dados e acesse todas as questões.</p>
            </div>
            <small>Todos os campos são obrigatórios.</small>
          </div>

          <label className="lead-form__field lead-form__field--wide">
            <span>Nome</span>
            <input name="name" type="text" autoComplete="name" placeholder="Como podemos te chamar?" minLength={2} required />
          </label>

          <label className="lead-form__field">
            <span>Idade</span>
            <input name="age" type="number" inputMode="numeric" placeholder="Ex.: 18" min={10} max={120} required />
          </label>

          <label className="lead-form__field">
            <span>Qual é seu foco agora?</span>
            <select name="objective" defaultValue="" required>
              <option value="" disabled>Selecione uma opção</option>
              {objectives.map((objective) => <option key={objective} value={objective}>{objective}</option>)}
            </select>
          </label>

          <label className="lead-form__field lead-form__field--wide">
            <span>E-mail</span>
            <input name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" required />
          </label>

          <label className="lead-form__field lead-form__field--wide">
            <span>Telefone</span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="(11) 99999-9999"
              aria-describedby={phoneError ? 'phone-error' : undefined}
              aria-invalid={phoneError ? 'true' : undefined}
              onChange={(event) => {
                validatePhone(event.currentTarget)
                if (phoneError) setPhoneError('')
              }}
              onInvalid={(event) => {
                if (event.currentTarget.validity.customError) setPhoneError(PHONE_ERROR)
              }}
              required
            />
            {phoneError && <small id="phone-error" className="lead-form__error" role="alert">{phoneError}</small>}
          </label>

          <button className="button button--primary lead-form__submit" type="submit">
            Começar as 100 questões <span aria-hidden="true">→</span>
          </button>
          <p className="lead-form__note">Leva menos de 1 minuto.</p>
        </form>
      </main>
    </div>
  )
}
