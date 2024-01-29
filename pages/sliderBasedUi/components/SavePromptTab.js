import { Button, Flex, Text, TextInput } from '@mantine/core'
import { useAtomValue } from 'jotai'
import { promptsAtom } from '../state'
import { useEffect, useState } from 'react'
import { settingsAtom } from '../../../src/state'
import { getLocalStore, localStorageKeys, setLocalStore } from '../utils'

export const SavePromptTab = () => {
  /* Get atom from Jotai storage */
  const promptsAtomValue = useAtomValue(promptsAtom)
  const settingsAtomValue = useAtomValue(settingsAtom)

  /* Get atom from local storage */
  const prompts = getLocalStore(localStorageKeys.prompt)

  /* Set textInput state */
  const [value, setValue] = useState(
    settingsAtomValue.basePrompt.replaceAll(' ', '-')
  )

  /* Set error state */
  const [error, setError] = useState('')

  useEffect(() => {
    /* Set error to empty */
    setError('')

    /* Validate if prompt setting already exist */
    const index = prompts.findIndex((p) => p.basePrompt === value)
    if (index !== -1) {
      setError('Prompt already exist')
    }
    if (!value) {
      setError('You need to add a name')
    }
    if (promptsAtomValue.length === 0) {
      setError('You need to add at least one prompt')
    }
  }, [value, prompts])

  /* Save prompt event */
  const savePrompt = (event) => {
    /* Prevent default of form */
    event.preventDefault()

    /* Add to local storage (Prompt, selectedPrompt) */
    const newPrompt = {
      basePrompt: value,
      promptsArray: promptsAtomValue,
    }
    setLocalStore(localStorageKeys.prompt, [...prompts, newPrompt])
    setLocalStore(localStorageKeys.selectedPrompt, newPrompt)
  }
  return (
    <Flex direction="column" gap="lg" >
      <Text size="xl">Save prompt</Text>

      <form onSubmit={savePrompt}>
        <Flex direction="column" gap="lg">
          <TextInput
            label="Name your prompt"
            error={error}
            placeholder="Name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button type="submit" disabled={error} variant="filled">
            Save
          </Button>
        </Flex>
      </form>
    </Flex>
  )
}
