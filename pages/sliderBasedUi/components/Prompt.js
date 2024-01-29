import { Button, Flex, Slider, TextInput } from '@mantine/core'
import { IconTrash } from '@tabler/icons'
import { isLableUnique } from '../utils'

export const Prompt = ({ prompt, onDelete, onChange }) => {
  return (
    <Flex direction="row" align="center" gap={0}>
      <Button variant="transparent" onClick={() => onDelete(prompt.id)}>
        <IconTrash size={25} color="#ED6969" />
      </Button>

      <Flex direction="column" gap={16}>
        <TextInput
          value={prompt.label}
          onChange={(e) => onChange(prompt.id, 'label', e.target.value)}
          error={isLableUnique(prompt.label) ? '' : 'Prompt is not unique.'}
        />
        {prompt.opposingPrompt && (
          <TextInput
            value={prompt.opposingPrompt}
            onChange={(e) => {
              onChange(prompt.id, 'opposingPrompt', e.target.value)
            }}
          />
        )}
        <Slider
          min={0}
          max={100}
          value={prompt.weight}
          onChange={(value) => {
            onChange(prompt.id, 'weight', value)
          }}
        />
      </Flex>
    </Flex>
  )
}
