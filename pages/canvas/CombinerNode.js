import { Badge, Button, Flex } from '@mantine/core'
import { useReactFlow, useStoreApi } from 'reactflow'
import 'reactflow/dist/style.css'
import { newImageNode } from './state'
import { promptsForNodes, weightsForNodes } from './utils'
import { IconArrowUpLeft } from '@tabler/icons'

const GenerateButton = ({ nodeId, position }) => {
  const { setNodes } = useReactFlow()
  const store = useStoreApi()

  const onGenerate = async () => {
    const { nodeInternals } = store.getState()
    const nodes = Array.from(nodeInternals.values())

    const weights = weightsForNodes(nodes, nodeId)
    const prompts = promptsForNodes(nodes)

    setNodes((nodes) => [
      ...nodes,
      newImageNode(prompts, weights, {
        x: position.x - 20,
        y: position.y - 20,
      }),
    ])
  }

  return <Button onClick={onGenerate}>Generate</Button>
}

const CombinerNode = ({ id, data, xPos, yPos }) => {
  const store = useStoreApi()
  const { nodeInternals } = store.getState()
  const nodes = Array.from(nodeInternals.values())
  const weights = weightsForNodes(nodes, id)

  return (
    <Flex direction="column" align="center" gap={4}>
      <Flex gap={4}>
        <IconArrowUpLeft />
        {weights.map((w, i) => (
          <Badge
            key={i}
            style={{ background: nodes[i].data.color, color: 'black' }}
          >
            {(w * 100).toFixed(0)}%
          </Badge>
        ))}
      </Flex>
      <GenerateButton nodeId={id} position={{ x: xPos, y: yPos }} />
    </Flex>
  )
}

export default CombinerNode
