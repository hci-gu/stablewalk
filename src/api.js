import axios from 'axios'
import { useAtom } from 'jotai'
import PQueue from 'p-queue'
import { useEffect, useMemo, useRef } from 'react'
import { seedAtom } from './state'

const queryString = ({ prompts, weights, seed }) => {
  return `?prompts=${prompts.join('|')}&weights=${weights.join(
    ','
  )}&seed=${seed}`
}

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

const getImage = async (prompts, weights, seed) => {
  console.log('getImage', prompts, weights, seed)
  const query = queryString({ prompts, weights, seed })

  if (cache[query]) {
    return cache[query]
  }

  const response = await queue.add(() => axios.get(`/api/image${query}`))

  cache[query] = response.data

  return response.data
}

export const useGetImage = () => {
  const [seed] = useAtom(seedAtom)
  const debouncedGetImage = useMemo(() => debounce(getImage, 500), [])

  useDidUpdateEffect(() => {
    console.log('CLEAR QUEUE')
    queue.clear()
  }, [seed])

  return debouncedGetImage
}
