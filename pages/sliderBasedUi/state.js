import axios from 'axios'
import { atom, useAtomValue } from 'jotai'
import { settingsAtom } from '../../src/state'

export const promptsAtom = atom([
  { id: 0, label: 'Cat', weight: 33 },
  { id: 1, label: 'Dog', weight: 33 },
  { id: 2, label: 'Owl', weight: 34 },
])

export const imgAtom = atom()

// const getImage = async (prompts, weights, seed, basePrompt) => {
//   const body = {
//     prompts: prompts.map((p) => p + basePrompt),
//     weights: weights.map((w) => w / 100),
//     seed,
//   }

//   const response = await axios.post(
//     `http://130.241.23.151:4000/combine`,
//     body,
//     {
//       responseType: 'blob',
//     }
//   )

//   return URL.createObjectURL(response.data)
// }

// export default getImage

const getImage = async (prompts, weights, seed, basePrompt) => {
  return new Promise(async function (reslove, reject) {
    const body = {
      prompts: prompts.map((p) => p + basePrompt),
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
    if (response) {
      reslove(URL.createObjectURL(response.data))
    }
    reject()
  })
}

export default getImage
