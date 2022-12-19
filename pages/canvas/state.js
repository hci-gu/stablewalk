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
    style: {
      pointerEvents: 'none',
      cursor: 'default',
    },
  }
}

export const newImageNode = (
  prompts,
  weights,
  position,
  size = { width: 40, height: 40 }
) => {
  const id = getId()
  return {
    id,
    type: 'image',
    data: {
      label: 'image ' + id,
      prompts,
      weights,
      ...size,
    },
    position,
    selectable: false,
  }
}

export const initialNodes = () => [newCombinerNode()]

const flowKey = 'flow'
export const saveFlowState = (instance) => {
  const flow = instance.toObject()
  localStorage.setItem(flowKey, JSON.stringify(flow))
}

export const loadFlowState = () => {
  const flow = localStorage.getItem(flowKey)
  return flow ? JSON.parse(flow) : null
}
