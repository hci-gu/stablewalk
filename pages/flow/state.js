import { atom } from 'jotai'

export const POSITION_DEBUGGER_TYPE = 'positionDebugger'

export const nodesAtom = atom([
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
])

export const positionNodesAtom = atom((get) => {
  const nodes = get(nodesAtom)

  return nodes.filter((node) => node.type === POSITION_DEBUGGER_TYPE)
})

export const distanceBetweenPositioNodesAtom = atom((get) => {
  const nodes = get(positionNodesAtom)

  const [first, second] = nodes

  if (!first || !second) return -1

  const x = first.position.x - second.position.x
  const y = first.position.y - second.position.y

  return Math.sqrt(x * x + y * y)
})

export const isDistanceOver500Atom = atom((get) => {
  const distance = get(distanceBetweenPositioNodesAtom)

  return distance > 500
})
