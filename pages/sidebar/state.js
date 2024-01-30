import { atom } from 'jotai'

export const nodesAtom = atom([
  { id: '1', position: { x: 100, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 300, y: 0 }, data: { label: '2' } },
])
