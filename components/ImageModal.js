import { Flex, Image, Modal, Text } from '@mantine/core'
import { useAtom, useAtomValue } from 'jotai'
import React from 'react'
import { modalImageAtom, seedAtom, settingsAtom } from '../src/state'

const ImageModal = () => {
  const [modalImage, setModalImage] = useAtom(modalImageAtom)
  const seed = useAtomValue(seedAtom)
  const settings = useAtomValue(settingsAtom)

  return (
    <Modal
      opened={!!modalImage}
      onClose={() => setModalImage(null)}
      centered
      size={600}
    >
      {modalImage && (
        <Flex direction="column" align="center">
          <Image width={512} height={512} src={modalImage.image} radius="md" />
          <Text>
            {modalImage.prompts
              .map((p, i) => `${p} (${modalImage.weights[i].toFixed(3)})`)
              .join('\n')}
            {`, seed: ${seed}, cfg: ${settings.cfg}, steps: ${settings.steps}`}
          </Text>
        </Flex>
      )}
    </Modal>
  )
}

export default ImageModal
