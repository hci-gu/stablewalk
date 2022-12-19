import { Button, Flex, Image, Modal, Text } from '@mantine/core'
import { useAtom, useAtomValue } from 'jotai'
import React from 'react'
import {
  modalImageAtom,
  seedAtom,
  sequenceAtom,
  settingsAtom,
} from '../src/state'

const ImageModal = () => {
  const [modalImage, setModalImage] = useAtom(modalImageAtom)
  const [{ from, to }, setSequence] = useAtom(sequenceAtom)
  const seed = useAtomValue(seedAtom)
  const settings = useAtomValue(settingsAtom)

  const isFrom = JSON.stringify(modalImage) === JSON.stringify(from)
  const isTo = JSON.stringify(modalImage) === JSON.stringify(to)

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
              .map((p, i) => `${p} (${modalImage.weights[i].toFixed(5)})`)
              .join('\n')}
            {`, seed: ${seed}, cfg: ${settings.cfg}, steps: ${settings.steps}`}
          </Text>
          <Flex gap="md">
            <Button
              onClick={() =>
                setSequence((s) => ({ ...s, from: isFrom ? null : modalImage }))
              }
              color={isFrom ? 'red' : 'blue'}
            >
              {isFrom ? 'clear' : 'Set from'}
            </Button>

            <Button
              onClick={() =>
                setSequence((s) => ({ ...s, to: isTo ? null : modalImage }))
              }
              color={isTo ? 'red' : 'blue'}
            >
              {isTo ? 'clear' : 'Set to'}
            </Button>
          </Flex>
        </Flex>
      )}
    </Modal>
  )
}

export default ImageModal
