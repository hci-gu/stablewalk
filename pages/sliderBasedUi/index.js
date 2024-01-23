import {
  Button,
  Divider,
  Flex,
  Image,
  Slider,
  Text,
  TextInput,
} from '@mantine/core'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import getImage, { promptsAtom } from './state'
import { useState } from 'react'
import { seedAtom } from '../../src/state'
import { IconTrash } from '@tabler/icons'

const NewPrompt = () => {
  const [prompt, setPrompt] = useState('')
  const setPrompts = useSetAtom(promptsAtom)

  const addAndReset = (e) => {
    e.preventDefault()

    setPrompts((s) => [...s, { id: s.length, label: prompt, weight: 0 }])
    setPrompt('')
  }

  return (
    <>
      <form onSubmit={(e) => addAndReset(e)}>
        <Flex w={'100%'} gap={8}>
          <TextInput
            w={'100%'}
            placeholder="dog"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button type="submit" disabled={prompt.length === 0}>
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
      <Text size={32}>New Prompt</Text>
      <NewPrompt />
      <SeedSelector />
    </>
  )
}

const Prompt = ({ prompt, onDelete, onChange }) => {
  return (
    <Flex direction="row" align="center" gap={0}>
      <Button variant="transparent" onClick={() => onDelete(prompt.id)}>
        <IconTrash size={25} color="#ED6969" />
      </Button>

      <Flex direction="column" gap={16}>
        <TextInput
          value={prompt.label}
          onChange={(e) => onChange(prompt.id, 'label', e.target.value)}
        />
        <Slider
          min={0}
          max={100}
          value={prompt.weight}
          onChange={(value) => {
            onChange(prompt.id, 'weight', value)
          }}
        />
      </Flex>
    </Flex>
  )
}

const PromptContainer = () => {
  const [prompts, setPrompts] = useAtom(promptsAtom)

  const deletePrompt = (id) => {
    setPrompts((s) => s.filter((val) => val.id !== id))
  }

  const updatePrompts = (id, field, value) => {
    setPrompts((s) =>
      s.map((prompt) => {
        if (prompt.id === id) {
          return { ...prompt, [field]: value }
        }
        return prompt
      })
    )
  }

  return (
    <>
      <Flex w={'100%'} direction={'column'} gap={16}>
        {prompts.map((prompt) => (
          <Prompt
            key={prompt.id}
            prompt={prompt}
            onDelete={deletePrompt}
            onChange={updatePrompts}
          />
        ))}
      </Flex>
    </>
  )
}

const axiosPost = async (prompts, seed) => {
  const p = prompts.map((p) => {
    return p.label
  })

  console.log('prompts', p)

  const w = prompts.map((p) => {
    return p.weight
  })
  console.log('weights', w)

  const res = await getImage(p, w, seed)
  console.log(res)
}

const Main = () => {
  const prompts = useAtomValue(promptsAtom)
  const seed = useAtomValue(seedAtom)
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
              <Button onClick={() => axiosPost(prompts, seed)}>
                get img response
              </Button>
              <Divider orientation="horizontal" w={'100%'} my={8} />
              <PromptContainer />
            </Flex>
            <Divider orientation="vertical" h={'75vh'} variant="solid" />
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
