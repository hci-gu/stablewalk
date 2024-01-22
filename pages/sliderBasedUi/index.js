import { Button, Flex, Image, Slider, Text, TextInput } from '@mantine/core'
import { useAtom, useAtomValue } from 'jotai'
import { newPromptAtom, promptsAtom } from './state'
import { useEffect, useState } from 'react'
import { seedAtom } from '../../src/state'
import { IconTrash } from '@tabler/icons'

const NewPrompt = () => {
  const [newPrompt, setNewPrompt] = useAtom(newPromptAtom)
  const [prompts, setPrompts] = useAtom(promptsAtom)

  const addAndReset = () => {
    setPrompts([...prompts, newPrompt])
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
        <Button
          disabled={newPrompt.label != '' ? false : true}
          onClick={addAndReset}
        >
          Add
        </Button>
      </Flex>
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
      <Text c={'white'} size={32}>
        New Prompt
      </Text>
      <NewPrompt />
      <SeedSelector />
    </>
  )
}

const Prompt = ({ prompt }) => {
  const [text, setText] = useState(prompt.label);
  const [weight, setWeight] = useState(prompt.weight);

  prompt.label = text;
  prompt.weight = weight;

  
  return (
    <Flex direction="row" align="center" gap={0}>
      <Button variant="transparent" onClick={() => {console.log(`click on ${prompt.id}`);}}>
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
  return (
    <>
      <Flex w={'100%'} direction={'column'} gap={16}>
        {promptsListener.map((prompt, index) => (
          <Prompt key={index} prompt={{ ...prompt, id: index }} />
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
