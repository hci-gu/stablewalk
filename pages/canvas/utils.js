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
  const combinerNodes = nodes.filter((n) => n.type === 'combiner')
  const imageNodes = nodes
    .filter((n) => n.type === 'image')
    .map((n) => {
      const weights = n.data.weights

      const position = promptNodes.reduce(
        (acc, curr, i) => {
          return {
            x: acc.x + curr.position.x * weights[i],
            y: acc.y + curr.position.y * weights[i],
          }
        },
        {
          x: 0,
          y: 0,
        }
      )

      return {
        ...n,
        position,
      }
    })

  return [...promptNodes, ...imageNodes, ...combinerNodes]
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

export const moveCombinerNode = (nodes, cursorPos) => {
  const promptNodes = nodes.filter((n) => n.type === 'prompt')
  if (!promptNodes.length) return nodes
  const combinerNode = nodes.find((n) => n.type === 'combiner')

  return nodes.map((n) => {
    if (n.id === combinerNode.id) {
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
