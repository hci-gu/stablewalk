import { Button, Flex, Image, SimpleGrid } from '@mantine/core'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import useWebSocket from './useWebsocket'
import { imagesAtom, seedAtom } from './state'
import { useViewportSize } from '@mantine/hooks'

const prompts = ['Painting of an ant', 'Painting of a elephant']

const ImageComp = ({ image, size }) => {
  const imageSrc = `data:image/png;base64,${image}`
  return <Image src={imageSrc} width={size} height={size} />
}

const Images = ({ size, numImages }) => {
  const images = useAtomValue(imagesAtom)

  return (
    <SimpleGrid
      cols={Math.floor(numImages / 5)}
      gap={0}
      spacing={0}
      verticalSpacing={0}
    >
      {images.map((image, i) => (
        <ImageComp {...image} index={i} size={size} />
      ))}
    </SimpleGrid>
  )
}

const ImageGenerator = ({ numImages }) => {
  const [seed, setSeed] = useAtom(seedAtom)
  const sendMessage = useWebSocket()
  const setImages = useSetAtom(imagesAtom)

  const startCombined = async () => {
    setImages([])
    for (let i = 0; i < numImages; i++) {
      // get weight1 from 0 to numImages based on index
      let weight1 = i / numImages
      let weight2 = 1 - weight1
      const image = await sendMessage({
        prompts,
        weights: [weight1, weight2],
        seed: i,
      })
      setImages((images) => [
        ...images,
        {
          image,
        },
      ])
    }
    setSeed(seed + numImages)
  }

  const rerun = async () => {
    let shuffledIndexes = Array.from({ length: numImages }, (_, i) => i)
    shuffledIndexes.sort(() => Math.random() - 0.5)

    for (let i = 0; i < shuffledIndexes.length; i++) {
      const index = shuffledIndexes[i]
      // get weight1 from 0 to numImages based on index
      let weight1 = index / numImages
      let weight2 = 1 - weight1
      const image = await sendMessage({
        prompts,
        weights: [weight1, weight2],
        seed: seed + i,
      })

      // replace image at index
      setImages((images) => [
        ...images.slice(0, index),
        {
          image,
        },
        ...images.slice(index + 1),
      ])
    }
    setSeed(seed + numImages)
    console.log('done')
  }

  useEffect(() => {
    console.log('seed', seed)
    if (seed == 0) {
      startCombined()
    } else if (seed > 0) {
      rerun()
    }
  }, [seed])

  return null
}

export default function Spam() {
  const { width, height } = useViewportSize()
  const imageHeight = (height - 60) / 4
  const numImages = Math.floor(width / imageHeight) * 5

  return (
    <>
      <ImageGenerator numImages={numImages} />
      <Images
        width={width}
        height={height}
        size={imageHeight}
        numImages={numImages}
      />
    </>
  )
}

Spam.Header = function () {
  const setSeed = useSetAtom(seedAtom)

  return (
    <Flex w="100%">
      <Button onClick={() => setSeed(0)}>Start</Button>
    </Flex>
  )
}
