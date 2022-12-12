import axios from 'axios'
import { useAtom } from 'jotai'
import PQueue from 'p-queue'
import { useEffect, useMemo, useRef } from 'react'
import { seedAtom } from './state'

const queue = new PQueue({ concurrency: 1 })
const cache = {}

function debounce(callback, wait) {
  let timer

  return (...args) => {
    clearTimeout(timer)
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(callback(...args)), wait)
    })
  }
}

function useDidUpdateEffect(fn, inputs) {
  const didMountRef = useRef(false)

  useEffect(() => {
    if (didMountRef.current) {
      return fn()
    }
    didMountRef.current = true
  }, inputs)
}

const getImage = async (
  prompts,
  weights,
  { basePrompt, negPrompt, steps, cfg, v2 },
  seed
) => {
  const body = {
    prompts,
    weights,
    seed,
    basePrompt,
    negPrompt,
    steps,
    cfg,
    v2,
  }

  const stringified = JSON.stringify(body)
  if (cache[stringified]) {
    return cache[stringified]
  }

  const response = await queue.add(() => axios.post(`/api/image`, body))

  cache[stringified] = response.data

  return response.data
}

export const useGetImage = () => {
  const [seed] = useAtom(seedAtom)
  const debouncedGetImage = useMemo(() => debounce(getImage, 500), [])

  useDidUpdateEffect(() => {
    queue.clear()
  }, [seed])

  return debouncedGetImage
}
