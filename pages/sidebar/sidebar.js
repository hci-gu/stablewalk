import {
  Container,
  Flex,
  Group,
  Slider,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { useAtom } from 'jotai'
import { seedAtom, settingsAtom } from '../../src/state.js'
import { useEffect } from 'react'
import { nodesAtom } from './state.js'

const BasePromptInput = () => {
  const [{ basePrompt }, set] = useAtom(settingsAtom)
  return (
    <TextInput
      label="Prompt flair"
      value={basePrompt}
      onChange={(e) => set({ basePrompt: e.target.value })}
      placeholder="example: poorly drawn hands"
    />
  )
}

const NegPromptInput = () => {
  const [{ negPrompt }, set] = useAtom(settingsAtom)
  return (
    <TextInput
      label="Negative prompt"
      value={negPrompt}
      onChange={(e) => set({ negPrompt: e.target.value })}
      placeholder="example: photograph, headshot, 4k"
    />
  )
}
const CFGInput = () => {
  const [{ cfg }, set] = useAtom(settingsAtom)

  return (
    <TextInput
      w={64}
      label="cfg"
      value={cfg}
      type="number"
      onChange={(e) => set({ cfg: parseFloat(e.target.value) })}
    />
  )
}

const SeedInput = () => {
  const [seed, setSeed] = useAtom(seedAtom)

  return (
    <TextInput
      w={64}
      label="seed"
      value={seed}
      type="number"
      placeholder="empty for random"
      onChange={(e) => setSeed(parseInt(e.target.value))}
    />
  )
}

const SeedStepInput = () => {
  const [seed, setSeed] = useAtom(seedAtom)
  const step = 25

  return (
    <>
      <div>
        <Text>seed</Text>
        <Slider
          defaultValue={seed}
          step={step}
          label={null}
          styles={{ markLabel: { display: 'none' } }}
          onChange={(seedValue) => setSeed(seedValue / step)}
        />
      </div>
    </>
  )
}

const NodesInput = () => {
  const [nodes, setNodes] = useAtom(nodesAtom)

  const updateNode = (id, value) => {
    const newArr = [...nodes]

    const index = newArr.findIndex((obj) => obj.id === id)

    newArr[index] = { ...newArr[index], data: { label: value } }

    setNodes(newArr)
  }

  return (
    <div>
      {nodes.map((node) => (
        <TextInput
          key={node.id}
          label={`${node.id}s prompt`}
          value={node.data.label}
          onChange={(e) => {
            updateNode(node.id, e.target.value)
          }}
        />
      ))}
    </div>
  )
}

const Sidebar = () => {
  return (
    <>
      <Container size="xs" m={0} bg="#d6d9dd">
        <Flex
          direction="column"
          gap="xs"
          align="stretch"
          h="82.1vh"
          justify="start"
        >
          <Text mt={25} fw={700}>
            Settings
          </Text>
          <BasePromptInput />
          <NegPromptInput />
          <SeedStepInput />
          <NodesInput />
        </Flex>
      </Container>
    </>
  )
}

export default Sidebar
