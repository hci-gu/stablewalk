import { Button, Flex, Image, Text } from '@mantine/core'
import axios from 'axios'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useState } from 'react'
import { settingsAtom } from '../../src/state'

const imagesAtom = atom([])

const generate = async (prompt, { steps, cfg, size }, seed) => {
  const body = {
    prompt,
    steps,
    cfg,
    size,
    seed,
  }

  const response = await axios.post(`/api/generate`, body)

  return response.data
}

const getImage = async (
  prompts,
  weights,
  { basePrompt, negPrompt, steps, cfg, size },
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
    size,
    v2: false,
  }

  const response = await axios.post(`/api/image`, body)

  return response.data.fileName
}
const displayTime = (value) => {
  if (value.toString().includes('.')) {
    return (value * 1000).toFixed(2)
  }
  return value
}

const ImageComp = ({ image, timestamps, index }) => {
  console.log('imageCOmp', image)
  // let start = timestamps?.start || 0
  // let inOrder = [
  //   'text_embeddings',
  //   'prompt_embeddings',
  //   'pooled_prompt_embeddings',
  //   'generate',
  //   'image_save',
  //   'file_written',
  // ]
  // let total = timestamps.end - start
  // let totalCompute = inOrder.reduce((acc, key) => {
  //   const time = timestamps[key]
  //   if (time.toString().includes('.')) {
  //     return acc + time * 1000
  //   }
  //   return acc + time
  // }, 0)
  // let latency = total - totalCompute
  // const times = inorder.map((key, i) => {
  //   // some are in seconds with decimals, convert these to ms
  //   let time = timestamps[key]
  //   if (time.toString().includes('.')) {
  //     time = time * 1000
  //   }
  //   return {
  //     key: key.replace('_time', ''),
  //     time,
  //   }
  // })
  // const timesWithDurations = times.map((time, i) => {
  //   let duration = 0
  //   if (i > 0) {
  //     duration = time.time - times[i - 1].time
  //   } else {
  //     duration = time.time - start
  //   }
  //   return {
  //     ...time,
  //     // round to 2 decimals
  //     duration: Math.round(duration * 100) / 100,
  //   }
  // })

  return (
    <Flex direction="column" key={`Image_${index}`}>
      <Image src={`/images/${image}`} width={100} height={100} />
      {/* {inOrder.map((key) => (
        <Flex direction="column">
          <Text size={8}>{key}</Text>
          <Text size={12} fw="bold">
            {displayTime(timestamps[key])}
          </Text>
        </Flex>
      ))}
      <Flex direction="column">
        <Text size={8}>Network</Text>
        <Text size={12} fw="bold">
          {latency.toFixed(2)}
        </Text>
      </Flex>
      <Text size={11}>
        Total: <strong> {timestamps.end - start}</strong>
      </Text> */}
    </Flex>
  )
}

const Images = () => {
  const images = useAtomValue(imagesAtom)

  return (
    <Flex gap="md">
      {images.map((image, i) => (
        <ImageComp {...image} index={i} />
      ))}
    </Flex>
  )
}

export default function Benchmark() {
  const settings = useAtomValue(settingsAtom)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const setImages = useSetAtom(imagesAtom)

  const startCombined = async () => {
    const promptsPairs = [
      ['Painting of a cat', 'Painting of a dog'],
      ['Painting of a bird', 'Painting of a cat'],
      ['Painting of a bird', 'Painting of a dog'],
      ['Painting of a bird', 'Painting of a horse'],
      ['Painting of a cat', 'Painting of a horse'],
      ['Painting of a dog', 'Painting of a horse'],
      ['Painting of a bird', 'Painting of a human'],
      ['Painting of a cat', 'Painting of a human'],
      ['Painting of a dog', 'Painting of a human'],
      ['Painting of a horse', 'Painting of a human'],
    ]

    let startTime = new Date().getTime()
    setImages([])
    for (let i = 0; i < 10; i++) {
      const prompts = promptsPairs[i]
      const weights = [0.5, 0.5]

      let start = new Date().getTime()
      const image = await getImage(prompts, weights, settings, 1)
      let end = new Date().getTime()
      setImages((images) => [
        ...images,
        {
          image,
          timestamps: {
            start,
            end,
          },
        },
      ])
    }
    let endTime = new Date().getTime()
    setTimeElapsed(endTime - startTime)
  }

  const startRegular = async () => {
    const prompts = [
      'Painting of a cat',
      'Painting of a dog',
      'Painting of a bird',
      'Painting of a horse',
      'Painting of a human',
      'Painting of a car',
      'Painting of a plane',
      'Painting of a boat',
      'Painting of a house',
      'Painting of a tree',
    ]

    let startTime = new Date().getTime()
    setImages([])
    for (let i = 0; i < 10; i++) {
      const prompt = prompts[i]

      const image = await generate(prompt, settings, 1)
      setImages((images) => [...images, image])
    }
    let endTime = new Date().getTime()
    setTimeElapsed(endTime - startTime)
  }

  return (
    <Flex mt="lg" direction="column">
      <Flex gap="lg">
        <Button w={160} onClick={startCombined}>
          Start combined
        </Button>
        <Button w={160} onClick={startRegular}>
          Start regular
        </Button>
      </Flex>
      <Flex mt="lg" gap="md">
        <Text>Time elapsed: {timeElapsed}ms</Text>
        <Text>Images per second: {10000 / timeElapsed}</Text>
      </Flex>

      <Images />
    </Flex>
  )
}

Benchmark.Header = function () {
  return <Flex w="100%" gap="md"></Flex>
}
