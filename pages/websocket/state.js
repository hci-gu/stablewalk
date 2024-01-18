import { atom } from 'jotai'
import allColors from 'nice-color-palettes'
const colors = allColors[0]

let id = 1
const getId = () => `${id++}`

export const newPromptNode = (prompt = '') => {
  const id = getId()
  return {
    id,
    type: 'prompt',
    data: {
      label: 'Prompt ' + id,
      prompts: [prompt],
      weights: [1],
      color: colors[parseInt(id) % colors.length],
    },
    position: { x: 100, y: 100 },
  }
}

export const newPreviewNode = () => {
  const id = getId()
  return {
    id,
    type: 'preview',
    data: {
      label: 'preview ' + id,
    },
    position: { x: 100, y: 100 },
    style: {
      pointerEvents: 'none',
      cursor: 'default',
    },
  }
}

export const initialNodes = () => [newPreviewNode()]

export const imageAtom = atom(null)
