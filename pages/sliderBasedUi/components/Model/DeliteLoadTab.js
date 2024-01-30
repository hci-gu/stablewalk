import { Button, Flex, NativeSelect, Text } from '@mantine/core'

export const DeliteLoadTab = ({
  loadPrompt,
  deletePrompt,
  selected,
  setSelected,
  prompts,
}) => (
  <Flex direction="column" gap="lg">
    <Text size="xl">Load prompt</Text>

    <NativeSelect
      disabled={prompts.length === 0}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      data={prompts.map((p) => p.basePrompt)}
    />
    <Flex gap="xl">
      <Button variant="filled" onClick={loadPrompt}>
        Load
      </Button>
      <Button variant="filled" color="red" onClick={deletePrompt}>
        Delete
      </Button>
    </Flex>
  </Flex>
)
