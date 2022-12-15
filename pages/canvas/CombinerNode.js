import { Badge, Flex } from '@mantine/core'
import { useStoreApi } from 'reactflow'
import 'reactflow/dist/style.css'
import { weightsForNodes } from './utils'

const CombinerNode = ({ xPos, yPos }) => {
  const store = useStoreApi()
  const { nodeInternals } = store.getState()
  const nodes = Array.from(nodeInternals.values())
  const weights = weightsForNodes(nodes, { x: xPos, y: yPos })

  return (
    <Flex gap={4} mb={44}>
      {weights.map((w, i) => (
        <Badge
          key={i}
          style={{
            background: nodes[i].data.color,
            color: 'black',
          }}
        >
          {(w * 100).toFixed(0)}%
        </Badge>
      ))}
    </Flex>
  )
}

export default CombinerNode
