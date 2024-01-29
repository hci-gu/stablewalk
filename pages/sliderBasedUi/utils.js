import { useAtomValue } from 'jotai'
import { promptsAtom } from './state'

export const getLocalStore = (key = 'Prompt') => {
  const local = localStorage.getItem(key)
  if (local) {
    return JSON.parse(local)
  }
  return []
}

export const setLocalStore = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const localStorageKeys = {
  prompt: 'Prompt',
  selectedPrompt: 'selectedPrompt',
}

export const isLableUnique = (label, newPrompt) => {
  const prompts = useAtomValue(promptsAtom)
  let isUnique = true
  const stringCount = {}
  if (newPrompt) {
    prompts.map((p) => {
      if (p.label === label) {
        isUnique = false
      }
    })
    return isUnique
  } else {
    if (prompts.length > 0 && label !== '') {
      prompts.map((p) => {
        if (p.label === label && stringCount[p.label] > 0) {
          isUnique = false
        } else {
          stringCount[p.label] = 1
        }
      })
      return isUnique
    } else {
      return true
    }
  }
}
