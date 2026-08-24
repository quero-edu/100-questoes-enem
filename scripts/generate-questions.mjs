import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = await readFile(path.join(root, 'content/100-questoes-enem.md'), 'utf8')
const areaMatches = [...source.matchAll(/^## ÁREA (\d) — (.+?) \(Questões (\d+)[–-](\d+)\)$/gm)]
const questionMatches = [...source.matchAll(/^### Questão (\d{2,3}) — (.+)$/gm)]

const areas = areaMatches.map((match, index) => ({
  id: Number(match[1]),
  name: match[2].trim(),
  shortName: ['Linguagens', 'Ciências Humanas', 'Ciências da Natureza', 'Matemática'][index],
  start: Number(match[3]),
  end: Number(match[4]),
}))

const questions = questionMatches.map((match, index) => {
  const number = Number(match[1])
  const blockStart = match.index + match[0].length
  const blockEnd = questionMatches[index + 1]?.index ?? source.indexOf('\n## RESUMO POR ÁREA', blockStart)
  const block = source.slice(blockStart, blockEnd).replace(/^\s*---\s*$/gm, '').trim()
  const answerMatch = block.match(/\*\*Gabarito: ([A-E])\*\*/)
  const explanationMatch = block.match(/\*\*Explicação:\*\*\s*([\s\S]+)$/)
  if (!answerMatch || !explanationMatch) throw new Error(`Questão ${number} incompleta`)

  const beforeAnswer = block.slice(0, answerMatch.index).trim()
  const optionMatches = [...beforeAnswer.matchAll(/^(\d)\.\s+(.+)$/gm)]
  if (optionMatches.length !== 5) throw new Error(`Questão ${number} tem ${optionMatches.length} alternativas`)
  const stem = beforeAnswer.slice(0, optionMatches[0].index).trim()
  const area = areas.find((item) => number >= item.start && number <= item.end)
  if (!area) throw new Error(`Área não encontrada para a questão ${number}`)

  return {
    number,
    areaId: area.id,
    area: area.name,
    areaShort: area.shortName,
    theme: match[2].trim(),
    stem,
    alternatives: optionMatches.map((option, optionIndex) => ({
      letter: String.fromCharCode(65 + optionIndex),
      text: option[2].trim(),
    })),
    answer: answerMatch[1],
    explanation: explanationMatch[1].trim(),
  }
})

if (questions.length !== 100) throw new Error(`Esperadas 100 questões; encontradas ${questions.length}`)

await writeFile(
  path.join(root, 'src/data/questions.json'),
  `${JSON.stringify(questions, null, 2)}\n`,
)

console.log(`Geradas ${questions.length} questões em src/data/questions.json`)
