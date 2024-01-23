import axios from 'axios'
import { atom } from 'jotai'

export const promptsAtom = atom([
  { id: 0, label: 'Cat', weight: 0.33 },
  { id: 1, label: 'Dog', weight: 0.33 },
  { id: 2, label: 'Owl', weight: 0.34 },
])

export const imgAtom = atom()

const getImage = async (prompts, weights, seed) => {
  const body = {
    prompts,
    weights,
    seed,
  }

  const response = await axios.post(`http://130.241.23.151:4000/combine`, body)

  return response.data
}

export default getImage
