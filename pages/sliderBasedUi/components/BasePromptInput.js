import { TextInput } from '@mantine/core'
import { useAtom } from 'jotai'
import { settingsAtom } from '../../../src/state'

export const BasePromptInput = () => {
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
