import { atom } from 'jotai'
import axios from 'axios'

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

export const fetchStuffWhenOver500Atom = atom(async (get) => {

})

// export const promptsAtom = atom([])
// export const seedAtom = atom(0)
// export const negativePromptAtom = atom('')

// export const imageAtom = atom(async (get) => {
//     const seed = get(seedAtom)
//     const prompts = get(promptsAtom)
//     const negativePrompt = get(negativePromptAtom)

//     const image = await axios.get('/api/image', {
//         prompts,
//         seed,
//         negativePrompt
//     })

//     return image
// })
