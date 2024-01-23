import axios from 'axios'
import { atom } from 'jotai'

export const promptsAtom = atom([
  { id: 0, label: 'Cat', weight: 0 },
  { id: 1, label: 'Dog', weight: 0 },
  { id: 2, label: 'Owl', weight: 0 },
])

const getImage = async (prompts, weights, seed) => {
  const body = {
    prompts,
    weights,
    seed,
  }

  const response = await axios.post(`/api/image`, body)

  return response.data
}

export default getImage
