import {
  Button,
  Divider,
  Flex,
  Image,
  Slider,
  Text,
  TextInput,
} from '@mantine/core'
import { useAtom, useAtomValue } from 'jotai'
import { newPromptAtom, promptsAtom } from './state'
import { use, useEffect, useState } from 'react'
import { seedAtom } from '../../src/state'
import { IconTrash } from '@tabler/icons'

const NewPrompt = () => {
  const [newPrompt, setNewPrompt] = useAtom(newPromptAtom)
  const [prompts, setPrompts] = useAtom(promptsAtom)

  const addAndReset = (e) => {
    e.preventDefault()
    setPrompts([...prompts, newPrompt])
    setNewPrompt({ id: 0, label: '', weight: 0 })
  }

  return (
    <>
      <form onSubmit={(e) => addAndReset(e)}>
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
          <Button type="submit" disabled={newPrompt.label != '' ? false : true}>
            Add
          </Button>
        </Flex>
      </form>
    </>
  )
}

const SeedSelector = () => {
  const [seed, setSeed] = useAtom(seedAtom)

  return (
    <>
      <Flex w={'100%'} gap={8}>
        <Button
          variant="outline"
          color="gray"
          w={'100%'}
          onClick={() => setSeed(seed - 1)}
        >
          Prev Seed
        </Button>
        <Button w={'100%'} onClick={() => setSeed(seed + 1)}>
          New Seed
        </Button>
      </Flex>
    </>
  )
}

const PromptAdder = () => {
  return (
    <>
      <Text size={32}>
        New Prompt
      </Text>
      <NewPrompt />
      <SeedSelector />
    </>
  )
}

const Prompt = ({ prompt }) => {
  const [prompts, setPrompts] = useAtom(promptsAtom)

  const delatePrompt = () => {
    const newPrompts = prompts.filter((val) => val.id !== prompt.id)

    setPrompts(() => newPrompts)
  }

  const [text, setText] = useState(prompt.label)
  const [weight, setWeight] = useState(prompt.weight)

  prompt.label = text
  prompt.weight = weight

  return (
    <Flex direction="row" align="center" gap={0}>
      <Button variant="transparent" onClick={delatePrompt}>
        <IconTrash size={25} color="#ED6969" />
      </Button>

      <Flex direction="column" gap={16}>
        <TextInput
          styles={{
            input: {
              border: '3px solid #73758C',
              color: 'white',
              backgroundColor: '#515262',
            },
          }}
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        />
        <Slider defaultValue={weight} onChange={(e) => setWeight(e)} />
      </Flex>
    </Flex>
  )
}

const PromptContainer = () => {
  const promptsListener = useAtomValue(promptsAtom)

  useEffect(() => {
    console.table(promptsListener)
  }, [promptsListener])

  return (
    <>
      <Flex w={'100%'} direction={'column'} gap={16}>
        {promptsListener.map((prompt, index) => (
          <Prompt key={index} prompt={{ ...prompt }} />
        ))}
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
          // bg={'#464755'}
          px={16}
          py={18}
          align={'center'}
          direction={'column'}
        >
          <Flex gap={32}>
            <Flex align={'center'} direction={'column'} gap={8}>
              <PromptAdder />
              <PromptContainer />
            </Flex>
            <Divider
              orientation="vertical"
              size={'sm'}
              h={'75vh'}
              variant="solid"
            />
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
