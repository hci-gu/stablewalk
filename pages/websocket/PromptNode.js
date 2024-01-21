import { Badge, Card, Flex } from '@mantine/core'
import { initialNodes } from './state'
import { useNodesState } from 'reactflow'
import AddPrompt from '../../components/AddPrompt'

const PromptNode = ({ data }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes())
  return (
    <Card
      shadow="sm"
      p="xs"
      radius="md"
      withBorder
      style={{ overflow: 'visible' }}
    >
      {data.prompts[0] ? (
        <Flex direction="column" gap="xs">
          <Badge style={{ background: data.color, color: 'black' }} maw={200}>
            {data.prompts[0]}
          </Badge>
        </Flex>
      ) : (
        <AddPrompt />
      )}
    </Card>
  )
}

export default PromptNode
