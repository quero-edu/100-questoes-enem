import type { ReactNode } from 'react'

function inline(text: string): ReactNode[] {
  return text.replaceAll('\\_', '_').split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : part,
  )
}

export function RichText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={className}>
      {text.split(/\n\s*\n/).map((paragraph, index) => (
        <p key={index}>{inline(paragraph.replace(/^>\s?/gm, ''))}</p>
      ))}
    </div>
  )
}
