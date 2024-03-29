import { Badge, Flex } from '@mantine/core'
import { useReactFlow, useStoreApi } from 'reactflow'
import 'reactflow/dist/style.css'
import { promptsForNodes, weightsForNodes } from './utils'
import PromptImage from '../../components/PromptImage'

const CombinerNode = ({ xPos, yPos, ...props }) => {
  const instance = useReactFlow()
  const store = useStoreApi()
  const { nodeInternals } = store.getState()
  const nodes = Array.from(nodeInternals.values())
  const prompts = promptsForNodes(nodes)
  const weights = weightsForNodes(nodes, { x: xPos, y: yPos })

  const zoom = Math.max(instance.getZoom(), 1)

  if (weights.length <= 1) return null

  return (
    <Flex gap={4} mb={160 + 64 / zoom} direction="column">
      <PromptImage
        prompts={prompts}
        weights={weights}
        width={256}
        height={256}
      />
      <Flex gap={4} justify="center">
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
    </Flex>
  )
}

export default CombinerNode
