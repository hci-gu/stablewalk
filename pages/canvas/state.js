import allColors from 'nice-color-palettes'
import { atom } from 'jotai'
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
      prompt,
      color: colors[parseInt(id) % colors.length],
    },
    position: { x: 100, y: 100 },
  }
}

export const newCombinerNode = () => {
  const id = getId()
  return {
    id,
    type: 'combiner',
    data: {
      label: 'combiner ' + id,
    },
    position: { x: 100, y: 100 },
  }
}

export const newImageNode = (image, position) => {
  const id = getId()
  return {
    id,
    type: 'image',
    data: {
      label: 'image ' + id,
      image,
    },
    position,
  }
}

export const initialNodes = []
// export const initialNodes = [
//   {
//     id: '1',
//     type: 'prompt',
//     data: {
//       label: 'Prompt 1',
//       prompt: 'Rose',
//       color: colors[0],
//     },
//     position: { x: 100, y: 100 },
//   },
//   {
//     id: '2',
//     type: 'prompt',
//     data: {
//       label: 'Prompt 2',
//       prompt: 'Cheese',
//       color: colors[1],
//     },
//     position: { x: 800, y: 100 },
//   },
//   {
//     id: '3',
//     type: 'prompt',
//     data: {
//       label: 'Prompt 3',
//       prompt: 'House',
//       color: colors[3],
//     },
//     position: { x: 400, y: 800 },
//   },
//   {
//     id: '4',
//     type: 'marker',
//     position: { x: 450, y: 450 },
//     data: {},
//   },
// ]

export const basePromptAtom = atom(null)

export const seedAtom = atom(null)
