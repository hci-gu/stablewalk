import { Flex, Image, LoadingOverlay, Text } from '@mantine/core'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useGetImage } from '../src/api'
import { modalImageAtom, seedAtom, settingsAtom } from '../src/state'

const PromptImage = ({ prompts, weights, width = 200, height = 200 }) => {
  const [, setModalImage] = useAtom(modalImageAtom)
  const [seed] = useAtom(seedAtom)
  const [settings] = useAtom(settingsAtom)
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const getImage = useGetImage()

  useEffect(() => {
    setLoading(true)

    getImage(prompts, weights, settings, seed).then((image) => {
      setImage(image)
      setLoading(false)
    })
  }, [prompts, weights, seed])

  return (
    <div style={{ width, height, position: 'relative' }}>
      <Image
        src={image}
        width={width}
        height={height}
        radius={width / 8}
        onClick={() =>
          setModalImage({
            prompts,
            weights,
            image,
          })
        }
        style={{
          cursor: 'pointer',
        }}
      />
      <LoadingOverlay
        visible={loading}
        w="100%"
        h="100%"
        overlayColor={image ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'}
        loaderProps={{
          size: width / 3,
          color: 'pink',
          variant: 'bars',
        }}
      />
    </div>
  )
}

export default PromptImage
