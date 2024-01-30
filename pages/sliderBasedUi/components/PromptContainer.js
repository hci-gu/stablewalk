import { Flex } from '@mantine/core'
import { useAtom } from 'jotai'
import { promptsAtom } from '../state'
import { Prompt } from './Prompt'

export const PromptContainer = () => {
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
