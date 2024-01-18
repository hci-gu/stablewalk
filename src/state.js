import { atom } from 'jotai'

export const seedAtom = atom(0)

export const settingsAtom = atom(
  {
    basePrompt: 'photograph, 4k',
    negPrompt:
      'Photoshop, video game, ugly, tiling, out of frame, extra limbs, extra legs, extra arms, cross-eye, body out of frame, blurry, bad art, bad anatomy, 3d render',
    steps: 1,
    cfg: 0,
    size: 512,
  },
  (get, set, update) => {
    set(settingsAtom, { ...get(settingsAtom), ...update })
  }
)

export const startedAtom = atom(false)

export const modalImageAtom = atom(null)

export const sequenceAtom = atom({
  editing: false,
  from: null,
  to: null,
  steps: 10,
  images: [],
})
