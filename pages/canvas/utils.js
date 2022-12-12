export const weightsForNodes = (nodes, combinerId) => {
  const promptNodes = nodes.filter((n) => n.type === 'prompt')
  const positions = promptNodes.map((n) => [n.position.x, n.position.y])
  const combinerPos = nodes.find((n) => n.id === combinerId).position

  const distances = positions.map(
    ([x, y]) =>
      1 / Math.hypot(combinerPos.x - (x + 100), combinerPos.y - (y + 100))
  )

  const totalDistance = distances.reduce((a, b) => a + b, 0)
  const weights = distances.map((d) => d / totalDistance)

  return weights
}

export const promptsForNodes = (nodes) => {
  const promptNodes = nodes.filter((n) => n.type === 'prompt')

  return promptNodes.map((n) => `${n.data.prompts[0]}`)
}
