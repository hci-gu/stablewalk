import axios from 'axios'
import { atom } from 'jotai'

export const promptsAtom = atom([
  { id: 0, label: 'Cat', weight: 33 },
  { id: 1, label: 'Dog', weight: 33 },
  { id: 2, label: 'Owl', weight: 34 },
])

export const imgAtom = atom()

const getImage = async (prompts, weights, seed) => {
  const body = {
    prompts,
    weights: weights.map((w) => w / 100),
    seed,
  }

  const response = await axios.post(
    `http://130.241.23.151:4000/combine`,
    body,
    {
      responseType: 'blob',
    }
  )

  return URL.createObjectURL(response.data)
}

export default getImage
