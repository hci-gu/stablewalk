import React from 'react'
import { Checkbox, Divider, Flex, Text, TextInput } from '@mantine/core'
import { useAtom } from 'jotai'
import { seedAtom, settingsAtom } from '../src/state'

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

const V2Checkbox = () => {
  const [{ v2 }, set] = useAtom(settingsAtom)

  return (
    <Checkbox
      label="v2"
      checked={v2}
      onChange={(e) => set({ v2: e.target.checked })}
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

const SizeInput = () => {
  const [{ size }, set] = useAtom(settingsAtom)

  return (
    <TextInput
      w={64}
      label="size"
      value={size}
      type="number"
      onChange={(e) => set({ size: parseInt(e.target.value) })}
    />
  )
}

const StepsInput = () => {
  const [{ steps }, set] = useAtom(settingsAtom)

  return (
    <TextInput
      w={64}
      label="steps"
      value={steps}
      type="number"
      onChange={(e) => set({ steps: parseInt(e.target.value) })}
    />
  )
}

const PromptSettings = () => {
  return (
    <Flex direction="column" gap={0}>
      <Text fw={700}>Settings</Text>
      <Flex gap="md" align="end">
        <Flex direction="column" w="320px">
          <BasePromptInput />
          <NegPromptInput />
        </Flex>
        <Flex direction="column">
          <Flex align="end" gap="md">
            <CFGInput />
            <StepsInput />
          </Flex>
          <Flex align="end" gap="md">
            <SeedInput />
            <SizeInput />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default PromptSettings
