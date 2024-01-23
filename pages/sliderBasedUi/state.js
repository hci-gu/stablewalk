import { atom } from 'jotai'

export const promptsAtom = atom([
  { id: 0, label: 'a', weight: 0 },
  { id: 1, label: 'b', weight: 0 },
  { id: 2, label: 'c', weight: 0 },
])
export const newPromptAtom = atom({ id: 0, label: '', weight: 0 })


const getImage = async (
    prompts,
    weights,
    seed
  ) => {
    const body = {
      prompts,
      weights,
      seed,
    }
  
    const response = await axios.post(`/api/image`, body)
  
    return response.data
  }