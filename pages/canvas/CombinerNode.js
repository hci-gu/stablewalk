import { Badge, Flex } from '@mantine/core'
import { useReactFlow, useStoreApi } from 'reactflow'
import 'reactflow/dist/style.css'
import { weightsForNodes } from './utils'

const CombinerNode = ({ xPos, yPos, ...props }) => {
  const instance = useReactFlow()
  const store = useStoreApi()
  const { nodeInternals } = store.getState()
  const nodes = Array.from(nodeInternals.values())
  const weights = weightsForNodes(nodes, { x: xPos, y: yPos })

  const zoom = Math.max(instance.getZoom(), 1)

  return (
    <Flex gap={4} mb={4 + 64 / zoom}>
      {weights.map((w, i) => (
        <Badge
          key={i}
          size={100 / zoom}
          h={40 / zoom}
          fz={16 / zoom}
          p={8 / zoom}
          style={{
            background: nodes[i].data.color,
            color: 'black',
            pointerEvents: 'none',
          }}
        >
          {(w * 100).toFixed(0)}%
        </Badge>
      ))}
    </Flex>
  )
}

export default CombinerNode
