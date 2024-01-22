import { atom } from 'jotai'

export const promptsAtom = atom([])
export const newPromptAtom = atom({ id: 0, label: '', weight: 0 })
