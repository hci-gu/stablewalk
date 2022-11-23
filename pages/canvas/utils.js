export const weightsForNodes = (nodes) => {
  const promptNodes = nodes.filter((n) => n.type === 'prompt')
  const positions = promptNodes.map((n) => [n.position.x, n.position.y])
  const markerPos = nodes.find((n) => n.type === 'combiner').position

  const distances = positions.map(
    ([x, y]) => 1 / Math.hypot(markerPos.x - x, markerPos.y - y)
  )

  const totalDistance = distances.reduce((a, b) => a + b, 0)
  const weights = distances.map((d) => d / totalDistance)

  return weights
}

export const promptsForNodes = (nodes, basePrompt) => {
  const promptNodes = nodes.filter((n) => n.type === 'prompt')

  return promptNodes.map(
    (n) => `${n.data.prompt}${basePrompt ? ', ' + basePrompt : ''}`
  )
}
