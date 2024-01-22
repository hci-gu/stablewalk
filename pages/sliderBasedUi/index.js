import { Button, Flex, Image, Text, TextInput } from '@mantine/core'
import { useAtom, useAtomValue } from 'jotai'
import { newPromptAtom, promptsAtom } from './state'
import { useEffect } from 'react'

const NewPrompt = () => {
  const [newPrompt, setNewPrompt] = useAtom(newPromptAtom)
  const [prompts, setPrompts] = useAtom(promptsAtom)

  const addAndReset = () => {
    setNewPrompt(prompts.push(newPrompt))
    setNewPrompt({ id: 0, label: '', weight: 0 })
  }

  return (
    <>
      <Flex w={'100%'} gap={8}>
        <TextInput
          w={'100%'}
          placeholder="dog"
          value={newPrompt.label}
          onChange={(e) =>
            setNewPrompt({
              ...newPrompt,
              id: prompts.length + 1,
              label: e.target.value,
            })
          }
        />
        <Button onClick={addAndReset}>Add</Button>
      </Flex>
    </>
  )
}

const SeedSelector = () => {
  return (
    <>
      <Flex w={'100%'} gap={8}>
        <Button variant="outline" color="gray" w={'100%'}>
          Prev Seed
        </Button>
        <Button w={'100%'}>New Seed</Button>
      </Flex>
    </>
  )
}

const PromptAdder = () => {
  return (
    <>
      <Text c={'white'} size={32}>
        New Prompt
      </Text>
      <NewPrompt />
      <SeedSelector />
    </>
  )
}

const PromptContainer = () => {
  const promptsListener = useAtomValue(promptsAtom)
  return (
    <>
      <Flex w={'100%'} direction={'column'} gap={16}>
        {useEffect(() => {
          console.log(promptsListener)
          promptsListener.map((prompt) => {
            return (
              <>
                <Text>{prompt.label}</Text>
              </>
            )
          })
        }, [promptsListener])}
      </Flex>
    </>
  )
}

const Main = () => {
  return (
    <>
      <main style={{ display: 'flex', width: '100%', height: '100%' }}>
        <Flex
          w={'40vw'}
          bg={'#464755'}
          px={16}
          py={18}
          align={'center'}
          direction={'column'}
        >
          <Flex align={'center'} direction={'column'} gap={8}>
            <PromptAdder />
            <PromptContainer />
          </Flex>
        </Flex>
        <Flex p={'64px'}>
          <Image src={'/RDT_20230521_1904024212403813380167502.jpg'} />
        </Flex>
      </main>
    </>
  )
}

export default Main
