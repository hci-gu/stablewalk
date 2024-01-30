import { Modal, Tabs } from '@mantine/core'
import { useAtom } from 'jotai'
import { promptsAtom } from '../../state'
import { useEffect, useState } from 'react'
import { seedAtom, settingsAtom } from '../../../../src/state'
import { getLocalStore, localStorageKeys, setLocalStore } from '../../utils'
import { SavePromptTab } from './SaveTab'
import { DeliteLoadTab } from './DeleteLoadTab'

export const PromptModal = ({ opened, close }) => {
  /* jotai */
  const [promptsAtomValue, setPromptsAtom] = useAtom(promptsAtom)
  const [settings, setSettings] = useAtom(settingsAtom)
  const [seed, setSeed] = useAtom(seedAtom)
  
  /* Local storage */
  const promptStorge = getLocalStore(localStorageKeys.prompt)
  const selectedPromptStorge = getLocalStore(localStorageKeys.selectedPrompt)

  /* State */
  const [prompts, setPrompts] = useState(promptStorge || []);
  const [selected, setSelected] = useState('')
  const [saveValue, setSaveValue] = useState(
    settings.basePrompt.replaceAll(' ', '-')
  )

  /* Set selected prompt */
  useEffect(() => {
    setSelected(selectedPromptStorge.basePrompt || promptStorge[0]?.basePrompt)
  }, [prompts])

  /* Load prompt event */
  const loadPrompt = () => {
    const selectedIndex = promptStorge.findIndex((p) => p.basePrompt === selected)

    if (selectedIndex === -1) {
      return
    }

    const newPrompt = promptStorge[selectedIndex]

    /* Set global variabel */
    setPromptsAtom(newPrompt.promptsArray)
    setSeed(newPrompt.seed)
    setSelected(newPrompt.basePrompt)
    setSettings({ basePrompt: newPrompt.basePrompt })
    setLocalStore(localStorageKeys.selectedPrompt, newPrompt)
  }

  /* Delete prompt event */
  const deletePrompt = () => {
    /* Check if prompts exist */
    if (promptStorge.length === 0) {
      return
    }

    /* Filter out selected prompt */
    const prompts = promptStorge.filter(
      (propt) => propt.basePrompt !== selected
    )

    
    /* Set global base prompt */
    const basePrompt = {
      basePrompt: '',
      seed: 0,
      promptsArray: [],
    }
    
    /* update global variabel */
    setPrompts(prompts)
    setPromptsAtom([])
    setLocalStore(localStorageKeys.prompt, prompts)
    setLocalStore(localStorageKeys.selectedPrompt, prompts[0] || basePrompt)
  }

  /* Save prompt event */
  const savePrompt = (event) => {
    /* Prevent default of form */
    event.preventDefault()

    /* Add to local storage (Prompt, selectedPrompt) */
    const newPrompt = {
      basePrompt: saveValue,
      seed,
      promptsArray: promptsAtomValue,
    }

    setPrompts([...promptStorge, newPrompt])
    setLocalStore(localStorageKeys.prompt, [...promptStorge, newPrompt])
    setLocalStore(localStorageKeys.selectedPrompt, newPrompt)
  }

  return (
    <Modal opened={opened} onClose={close} title="Promps" centered>
      <Tabs defaultValue="Load">
        <Tabs.List>
          <Tabs.Tab value="Load">Load</Tabs.Tab>
          <Tabs.Tab value="Save prompt">Save prompt</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="Load">
          <DeliteLoadTab
            deletePrompt={deletePrompt}
            loadPrompt={loadPrompt}
            setSelected={setSelected}
            selected={selected}
            prompts={prompts}
          />
        </Tabs.Panel>

        <Tabs.Panel value="Save prompt">
          <SavePromptTab
            savePrompt={savePrompt}
            saveValue={saveValue}
            setSaveValue={setSaveValue}
          />
        </Tabs.Panel>
      </Tabs>
    </Modal>
  )
}
