import {
  Button,
  Collapse,
  Divider,
  Flex,
  Image,
  Modal,
  NativeSelect,
  Slider,
  Tabs,
  Text,
  TextInput,
} from '@mantine/core'
import dynamic from 'next/dynamic'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import getImage, { imgAtom, mainPromtAtom, promptsAtom } from './state'
import { useEffect, useMemo, useState } from 'react'
import { seedAtom, settingsAtom } from '../../src/state'
import { IconTrash } from '@tabler/icons'
import { useDisclosure } from '@mantine/hooks'
import { getLocalStore, setLocalStore } from './utils'

const NewPrompt = () => {
  const [prompt, setPrompt] = useState('')
  const setPrompts = useSetAtom(promptsAtom)
  const [opend, { toggle }] = useDisclosure(false)
  const [oppositePrompt, setOppositePrompt] = useState('')

  const getUniqueId = (array) => {
    // console.log(array)
    if (array.length > 0) {
      return array[array.length - 1].id + 1
    }
    // console.log(array.length)

    return 1
  }

  const addAndReset = (e) => {
    e.preventDefault()

    if (oppositePrompt === '') {
      setPrompts((s) => [
        ...s,
        { id: getUniqueId(s), label: prompt, weight: 0 },
      ])
    } else {
      setPrompts((s) => [
        ...s,
        {
          id: getUniqueId(s),
          label: prompt,
          opposingPrompt: oppositePrompt,
          weight: 0,
        },
      ])
    }
    setOppositePrompt('')
    setPrompt('')
  }

  return (
    <>
      <form onSubmit={(e) => addAndReset(e)}>
        <Flex w={'100%'} gap={8}>
          <TextInput
            w={'100%'}
            placeholder="Hat or fluffy fur"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button type="submit" disabled={prompt.length === 0}>
            Add
          </Button>
          <Button onClick={toggle}></Button>
        </Flex>
        <Flex w={'100%'}>
          <Collapse in={opend}>
            <TextInput
              pt={8}
              placeholder="An opposing prompt"
              value={oppositePrompt}
              onChange={(e) => {
                setOppositePrompt(e.target.value)
              }}
            />
          </Collapse>
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
      <Text size={24}>New addetive Prompt</Text>
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
        {prompt.opposingPrompt && (
          <TextInput
            value={prompt.opposingPrompt}
            onChange={(e) => {
              onChange(prompt.id, 'opposingPrompt', e.target.value)
            }}
          />
        )}
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

// const imageQueue = []

const ImgGetter = () => {
  const prompts = useAtomValue(promptsAtom)
  const seed = useAtomValue(seedAtom)
  const setImg = useSetAtom(imgAtom)
  const { basePrompt } = useAtomValue(settingsAtom)
  const imageQueue = useMemo(() => [], [])

  useEffect(() => {
    const sendFunc = async () => {
      const p = prompts.map((p) => {
        return p.label
      })
      const w = prompts.map((p) => {
        return p.weight
      })

      if (imageQueue.length > 0) {
        return
      }
      const imageRequest = getImage(p, w, seed, basePrompt)
      imageQueue.push(imageRequest)
      const image = await imageRequest
      setImg(image)
      imageQueue.shift()
    }
    console.log(prompts)
    sendFunc()
  }, [prompts, seed, basePrompt])
}

const BasePromptInput = () => {
  const [{ basePrompt }, set] = useAtom(settingsAtom)
  return (
    <>
      <form>
        <TextInput
          w={'70vh'}
          placeholder="dog"
          value={basePrompt}
          onChange={(e) => {
            set({ basePrompt: e.target.value })
          }}
        />
      </form>
    </>
  )
}

;[
  {
    basePrompt: '4k photo of a cat',
    promptsArray: [
      { id: 0, label: 'Cute', weight: 0 },
      { id: 1, label: 'Fluffy', weight: 0 },
      { id: 2, label: 'Orange fur', weight: 0 },
    ],
  },
  {
    basePrompt: '4k photo of a bike',
    promptsArray: [
      { id: 0, label: 'fast', weight: 0 },
      { id: 1, label: 'big', weight: 0 },
      { id: 2, label: 'red', weight: 0 },
    ],
  },
]

export const PromptModal = ({ opened, close }) => {
  const promptStorge = getLocalStore('Prompt')
  const setPrompts = useSetAtom(promptsAtom)
  const selectedPromptStorge = getLocalStore('selectedPrompt')
  const [selected, setSelected] = useState(
    selectedPromptStorge.basePrompt || promptStorge[0]?.basePrompt || ''
  )
  const [{ basePrompt }, setBasePrompt] = useAtom(settingsAtom)
  const loadPrompt = () => {
    const i = promptStorge.findIndex((p) => p.basePrompt === selected)

    if (i === -1) {
      return
    }
    setPrompts(promptStorge[i].promptsArray)
    setSelected(promptStorge[i].basePrompt)
    setBasePrompt({ basePrompt: promptStorge[i].basePrompt })
    setLocalStore('selectedPrompt', promptStorge[i])
  }

  const delitePrompt = () => {
    if (promptStorge.length === 0) {
      return
    }

    const prompts = promptStorge.filter(
      (propt) => propt.basePrompt !== selected
    )

    console.log(prompts)

    setPrompts([])
    setLocalStore('Prompt', prompts)
    setLocalStore('selectedPrompt', { basePrompt: '', promptsArray: [] })
  }

  return (
    <Modal opened={opened} onClose={close} title="Promps" centered>
      <Tabs defaultValue="Load">
        <Tabs.List>
          <Tabs.Tab value="Load">Load</Tabs.Tab>
          <Tabs.Tab value="Save prompt">Save prompt</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="Load">
          <Flex direction="column" gap="lg">
            <Text size="xl">Save prompt</Text>

            <NativeSelect
              disabled={promptStorge.length === 0}
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              data={promptStorge.map((p) => p.basePrompt)}
            />
            <Flex gap="xl">
              <Button variant="filled" onClick={loadPrompt}>
                Load
              </Button>
              <Button variant="filled" color="red" onClick={delitePrompt}>
                Delete
              </Button>
            </Flex>
          </Flex>
        </Tabs.Panel>

        <Tabs.Panel value="Save prompt">Save prompt tab content</Tabs.Panel>
      </Tabs>
    </Modal>
  )
}

const Main = () => {
  const img = useAtomValue(imgAtom)
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <main style={{ display: 'flex', width: '100%', height: '100%' }}>
        <Flex
          // w={'40vw'}
          // bg={'#464755'}
          // px={16}
          pr={32}
          py={18}
          align={'center'}
          direction={'column'}
        >
          <Flex>
            <Flex align={'center'} direction={'column'} gap={8}>
              <PromptAdder />
              <ImgGetter />
              <Divider orientation="horizontal" w={'100%'} my={8} />
              <PromptContainer />
              <Button onClick={open} w="100%">
                Open seve Prompts
              </Button>
            </Flex>
          </Flex>
        </Flex>
        <Divider orientation="vertical" h={'100%'} variant="solid" pr={32} />
        <Flex
          w={'100%'}
          justify={'center'}
          align={'center'}
          direction={'column'}
          gap={8}
        >
          {/* <Image src={'/RDT_20230521_1904024212403813380167502.jpg'} /> */}
          <Image src={img} width={'70vh'} height={'70vh'} />
          <BasePromptInput />
          <PromptModal opened={opened} close={close} />
        </Flex>
      </main>
    </>
  )
}

export default dynamic(async () => Main, {
  ssr: false,
})
