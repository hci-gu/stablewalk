import { Badge, Card, Flex, Text, Textarea } from '@mantine/core'
import { useReactFlow, useStoreApi } from 'reactflow'

const PromptNode = ({ data, xPos, yPos, id }) => {
  const { setNodes } = useReactFlow()
  const store = useStoreApi()

  const onPromptChange = (newPrompt) => {
    const { nodeInternals } = store.getState()
    setNodes(
      Array.from(nodeInternals.values()).map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            prompt: newPrompt,
          }
        }
        return node
      })
    )
  }

  return (
    <Card shadow="sm" p="xs" radius="md" withBorder>
      <Flex justify="space-between">
        <Badge style={{ background: data.color, color: 'black' }}>
          Prompt {id}
        </Badge>
        <Text size={11}>
          {xPos.toFixed(0)}, {yPos.toFixed(0)}
        </Text>
      </Flex>
      <Textarea
        mt={4}
        value={data.prompt}
        onChange={(e) => onPromptChange(e.target.value)}
      />
    </Card>
  )
}

export default PromptNode
