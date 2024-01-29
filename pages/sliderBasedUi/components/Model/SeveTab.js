import { Button, Flex, Text, TextInput } from '@mantine/core'
import { useAtomValue } from 'jotai'
import { promptsAtom } from '../../state'
import { useEffect, useState } from 'react'
import { getLocalStore, localStorageKeys } from '../../utils'

export const SavePromptTab = ({ savePrompt, saveValue, setSaveValue }) => {
  /* Get atom from Jotai storage */
  const promptsAtomValue = useAtomValue(promptsAtom)

  /* Get atom from local storage */
  const promptStorge = getLocalStore(localStorageKeys.prompt)

  /* Set error state */
  const [error, setError] = useState('')

  useEffect(() => {
    /* Set error to empty */
    setError('')

    /* Validate if prompt setting already exist */
    const index = promptStorge.findIndex(
      (p) => p.basePrompt.replaceAll(' ', '-') === saveValue
    )
    if (index !== -1) {
      setError('Prompt already exist')
    }
    console.log({ promptStorge, saveValue, index })
    if (!saveValue) {
      setError('You need to add a name')
    }
    if (promptsAtomValue.length === 0) {
      setError('You need to add at least one prompt')
    }
  }, [saveValue, promptStorge])

  return (
    <Flex direction="column" gap="lg" >
      <Text size="xl">Save prompt</Text>

      <form onSubmit={savePrompt}>
        <Flex direction="column" gap="lg">
          <TextInput
            label="Name your prompt"
            error={error}
            placeholder="Name"
            value={saveValue}
            onChange={(e) => setSaveValue(e.target.value)}
          />
          <Button type="submit" disabled={error} variant="filled">
            Save
          </Button>
        </Flex>
      </form>
    </Flex>
  )
}
