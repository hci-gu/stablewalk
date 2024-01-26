import axios from 'axios'
import { atom } from 'jotai'

export const promptsAtom = atom([
  // { id: 0, label: 'Cute', weight: 0 },
  // { id: 1, label: 'Fluffy', weight: 0 },
  // { id: 2, label: 'Orange fur', weight: 0 },
])

export const imgAtom = atom()

const getImage = async (prompts, weights, seed, basePrompt) => {
  if (prompts.length === 0) {
    prompts.push('clear')
    weights.push(0)
  }

  const body = {
    base_prompt: basePrompt,
    prompts: prompts.map((p) => p),
    weights: weights.map((w) => w / 100),
    seed,
  }

  const response = await axios.post(
    `http://130.241.23.151:4000/combine-attributes`,
    body,
    {
      responseType: 'blob',
    }
  )
  // console.log('got image response')

  return URL.createObjectURL(response.data)
}

export default getImage
