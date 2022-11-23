import { Badge, Button, Flex, Image } from '@mantine/core'
import { useReactFlow, useStoreApi } from 'reactflow'
import 'reactflow/dist/style.css'
import axios from 'axios'
import { basePromptAtom, newImageNode, seedAtom } from './state'
import { useAtom } from 'jotai'
import { promptsForNodes, weightsForNodes } from './utils'
import { IconArrowUpLeft } from '@tabler/icons'
import * as api from './api'

const GenerateButton = ({ nodeId, position }) => {
  const { setNodes } = useReactFlow()
  const [seed] = useAtom(seedAtom)
  const [basePrompt] = useAtom(basePromptAtom)
  const store = useStoreApi()

  const onGenerate = async () => {
    const imageNode = newImageNode(null, {
      x: position.x - 20,
      y: position.y - 20,
    })
    setNodes((nodes) => [...nodes, imageNode])

    const { nodeInternals } = store.getState()
    const nodes = Array.from(nodeInternals.values())

    const weights = weightsForNodes(nodes, nodeId)
    const prompts = promptsForNodes(nodes, basePrompt)
    const image = await api.getImage(prompts, weights, seed)

    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === imageNode.id) {
          node.data = {
            ...node.data,
            image,
          }
        }
        return node
      })
    )
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
