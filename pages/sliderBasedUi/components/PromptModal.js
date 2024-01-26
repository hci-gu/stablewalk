import { Button, Flex, Modal, NativeSelect, Tabs, Text } from '@mantine/core'
import { useAtom, useSetAtom } from 'jotai'
import { promptsAtom } from '../state'
import { useEffect, useState } from 'react'
import { settingsAtom } from '../../../src/state'
import { getLocalStore, localStorageKeys, setLocalStore } from '../utils'
import { SevePromptTab } from './SevePromptTab'

export const PromptModal = ({ opened, close }) => {
  const promptStorge = getLocalStore(localStorageKeys.prompt)
  const [promptsAtomValue, setPrompts] = useAtom(promptsAtom)
  const selectedPromptStorge = getLocalStore(localStorageKeys.selectedPrompt)

  const [selected, setSelected] = useState('')

  useEffect(() => {
    setSelected(selectedPromptStorge.basePrompt || promptStorge[0]?.basePrompt)
  }, [])

  const setBasePrompt = useSetAtom(settingsAtom)
  const loadPrompt = () => {
    const i = promptStorge.findIndex((p) => p.basePrompt === selected)

    if (i === -1) {
      return
    }

    const newPrompt = promptStorge[i]

    /* Set global variabel */
    setPrompts(newPrompt.promptsArray)
    setSelected(newPrompt.basePrompt)
    setBasePrompt({ basePrompt: newPrompt.basePrompt })
    setLocalStore(localStorageKeys.selectedPrompt, newPrompt)
  }

  const delitePrompt = () => {
    if (promptStorge.length === 0) {
      return
    }

    const prompts = promptStorge.filter(
      (propt) => propt.basePrompt !== selected
    )

    setPrompts([])
    setLocalStore(localStorageKeys.prompt, prompts)
    setLocalStore(localStorageKeys.selectedPrompt, {
      basePrompt: '',
      promptsArray: [],
    })
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
            <Text size="xl">Load prompt</Text>

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

        <Tabs.Panel value="Save prompt">
          <SevePromptTab />
        </Tabs.Panel>
      </Tabs>
    </Modal>
  )
}
