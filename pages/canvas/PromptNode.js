import { ActionIcon, Badge, Card, Flex } from '@mantine/core'
import { IconX } from '@tabler/icons'
import { useReactFlow, useStoreApi } from 'reactflow'
import PromptImage from '../../components/PromptImage'

const PromptNode = ({ id, data }) => {
  const { setNodes } = useReactFlow()
  const store = useStoreApi()

  const onDelete = () => {
    console.log('onDelete')
    const { nodeInternals } = store.getState()
    const nodes = Array.from(nodeInternals.values())

    const newNodes = nodes.filter((n) => n.id !== id)
    console.log(id, nodes, newNodes)
    setNodes(newNodes)
  }

  return (
    <Card
      shadow="sm"
      p="xs"
      radius="md"
      withBorder
      style={{ overflow: 'visible' }}
    >
      <ActionIcon
        style={{ position: 'absolute', left: -8, top: -8 }}
        size="xs"
        variant="filled"
        radius={24}
        color="red"
        onClick={() => onDelete()}
      >
        <IconX />
      </ActionIcon>
      <Flex direction="column" gap="xs">
        <Badge style={{ background: data.color, color: 'black' }} maw={200}>
          {data.prompts[0]}
        </Badge>
        <PromptImage {...data} />
      </Flex>
    </Card>
  )
}

export default PromptNode
