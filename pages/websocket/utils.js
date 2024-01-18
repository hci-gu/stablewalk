import { calculateLinearCombination } from './linear'
import { newImageNode } from './state'

export const weightsForNodes = (nodes, position) => {
  const promptNodes = nodes.filter((n) => n.type === 'prompt')
  if (promptNodes.length === 0) return []

  const positions = promptNodes.map((n) => [n.position.x, n.position.y])

  const weights = calculateLinearCombination(positions, [
    position.x,
    position.y,
  ])

  return weights
}

export const promptsForNodes = (nodes) => {
  const promptNodes = nodes.filter((n) => n.type === 'prompt')

  return promptNodes.map((n) => `${n.data.prompts[0]}`)
}

export const makeUpdatesForChange = (change, nodes) => {
  const promptNodes = nodes.filter((n) => n.type === 'prompt')
  const previewNodes = nodes.filter((n) => n.type === 'preview')

  return [...promptNodes, ...previewNodes]
}

export const sizeForZoom = (zoom) => ({ width: 40 / zoom, height: 40 / zoom })

export const updateNodesForZoom = (nodes, zoom) => {
  const imageNodes = nodes.filter((n) => n.type === 'image')
  const rest = nodes.filter((n) => n.type !== 'image')
  return [
    ...imageNodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        ...sizeForZoom(zoom),
      },
    })),
    ...rest,
  ]
}

export const movePreviewNode = (nodes, cursorPos, settings, seed, emit) => {
  const promptNodes = nodes.filter((n) => n.type === 'prompt')
  if (!promptNodes.length) return nodes
  const combinerNode = nodes.find((n) => n.type === 'preview')

  const prompts = promptsForNodes(promptNodes)
  const weights = weightsForNodes(promptNodes, cursorPos)

  emit({
    prompts: prompts.map((prompt) => `${prompt}, ${settings.basePrompt}`),
    weights,
    seed,
  })

  return nodes.map((n) => {
    if (n.id === combinerNode.id) {
      console.log('mov me')
      return {
        ...n,
        position: {
          x: cursorPos.x,
          y: cursorPos.y,
        },
      }
    }
    return n
  })
}

export const addImageNodeForPosition = (nodes, position, zoom) => {
  const weights = weightsForNodes(nodes, position)
  if (weights.length === 0) return nodes
  const prompts = promptsForNodes(nodes)

  const newNode = newImageNode(prompts, weights, position, sizeForZoom(zoom))

  return [...nodes, newNode]
}
