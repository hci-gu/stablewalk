import { Text } from '@mantine/core'
import { NewPrompt } from './NewPrompt'
import { SeedSelector } from './SeedSelector'

export const PromptAdder = () => {
  return (
    <>
      <Text size={24}>New addetive Prompt</Text>
      <NewPrompt />
      <SeedSelector />
    </>
  )
}
