import { Text } from '@mantine/core'
import { NewPrompt } from './NewPrompt'
import { SeedSelector } from './SeedSelector'

export const PromptAdder = () => {
  return (
    <>
      <Text size={20}>New descriptive prompt</Text>
      <NewPrompt />
      <SeedSelector />
    </>
  )
}
