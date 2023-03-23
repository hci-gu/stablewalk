import {
  Badge,
  Button,
  Card,
  Flex,
  Image,
  Modal,
  SimpleGrid,
  Text,
} from '@mantine/core'
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
        <Flex direction="column" align="center" gap="md">
          <Image width={512} height={512} src={modalImage.image} radius="md" />
          <SimpleGrid gap="xs" cols={3}>
            {modalImage.prompts
              .map((p, i) => `${p} (${modalImage.weights[i].toFixed(5)})`)
              .map((t) => (
                <Card p={4} withBorder radius="lg">
                  <Text align="center">
                    <strong>{t.split(' ')[0]}</strong> {t.split(' ')[1]}
                  </Text>
                </Card>
              ))}
          </SimpleGrid>
          <Text align="center">
            {`seed: ${seed}  cfg: ${settings.cfg} steps: ${settings.steps}`}
          </Text>
        </Flex>
      )}
    </Modal>
  )
}

export default ImageModal
