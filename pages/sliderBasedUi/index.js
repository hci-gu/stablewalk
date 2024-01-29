import { Button, Divider, Flex, Image, Stack } from '@mantine/core'
import dynamic from 'next/dynamic'
import { useAtomValue, useSetAtom } from 'jotai'
import getImage, { imgAtom, promptsAtom } from './state'
import { useDisclosure } from '@mantine/hooks'
import { PromptModal } from './components/PromptModal'
import { BasePromptInput } from './components/BasePromptInput'
import { PromptContainer } from './components/PromptContainer'
import { PromptAdder } from './components/PromptAdder'
import { seedAtom, settingsAtom } from '../../src/state'
import { useEffect, useMemo } from 'react'

export const ImgGetter = () => {
  const prompts = useAtomValue(promptsAtom)
  const seed = useAtomValue(seedAtom)
  const setImg = useSetAtom(imgAtom)
  const { basePrompt } = useAtomValue(settingsAtom)
  const imageQueue = useMemo(() => [], [])

  useEffect(() => {
    const sendFunc = async () => {
      const p = prompts.map((p) => p.label)
      const w = prompts.map((p) => p.weight)

      if (imageQueue.length > 0) {
        return
      }
      const imageRequest = getImage(p, w, seed, basePrompt)
      imageQueue.push(imageRequest)
      const image = await imageRequest
      setImg(image)
      imageQueue.shift()
    }
    sendFunc()
  }, [prompts, seed, basePrompt])
}

// ;[
//   {
//     basePrompt: '4k photo of a cat',
//     promptsArray: [
//       { id: 0, label: 'Cute', weight: 0 },
//       { id: 1, label: 'Fluffy', weight: 0 },
//       { id: 2, label: 'Orange fur', weight: 0 },
//     ],
//   },
//   {
//     basePrompt: '4k photo of a bike',
//     promptsArray: [
//       { id: 0, label: 'fast', weight: 0 },
//       { id: 1, label: 'big', weight: 0 },
//       { id: 2, label: 'red', weight: 0 },
//     ],
//   },
// ]

const Main = () => {
  const img = useAtomValue(imgAtom)
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <Flex pr={32} py={18} align={'center'} direction={'column'} gap={8}>
          <PromptAdder />
          <ImgGetter />
          <Divider orientation="horizontal" w={'100%'} my={8} />
          <Stack h={'100%'} justify="space-between">
            <PromptContainer />
            <Button onClick={open} w="100%">
              Open save Prompts
            </Button>
          </Stack>
        </Flex>
        <Divider orientation="vertical" h={'100%'} variant="solid" pr={32} />
        <Flex
          w={'100%'}
          justify={'center'}
          align={'center'}
          direction={'column'}
          gap={8}
        >
          <Image src={img} width={'70vh'} height={'70vh'} />
          <BasePromptInput />
          <PromptModal opened={opened} close={close} />
        </Flex>
      </div>
    </>
  )
}

export default dynamic(async () => Main, {
  ssr: false,
})
