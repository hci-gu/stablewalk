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

export const newImageNode = (prompts, weights, position) => {
  const id = getId()
  return {
    id,
    type: 'image',
    data: {
      label: 'image ' + id,
      prompts,
      weights,
    },
    position,
  }
}

export const initialNodes = []
