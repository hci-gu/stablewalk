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
  if (!label.trim()) {
    return true
  }
  if (newPrompt) {
    return !prompts.some((p) => p.label === label)
  }
  const lableSet = new Set()
  for (const p of prompts) {
    console.log()
    if (p.label === label && lableSet.has(p.label)) {
      return false
    }
    lableSet.add(p.label)
  }
  return true
}
