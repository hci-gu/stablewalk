import { Badge, Button, Flex, Image } from '@mantine/core'
import { useReactFlow, useStoreApi } from 'reactflow'
import 'reactflow/dist/style.css'
import axios from 'axios'
import { basePromptAtom } from './state'
import { useAtom } from 'jotai'
import { promptsForNodes, weightsForNodes } from './utils'

const GenerateButton = ({ nodeId }) => {
  const { setNodes } = useReactFlow()
  const [basePrompt] = useAtom(basePromptAtom)
  const store = useStoreApi()

  const onGenerate = async () => {
    const { nodeInternals } = store.getState()
    const nodes = Array.from(nodeInternals.values())

    const weights = weightsForNodes(nodes, nodeId)
    const prompts = promptsForNodes(nodes, basePrompt)
    const response = await axios.post(
      `http://leviathan.itit.gu.se:5000/combine`,
      { prompts, weights },
      { responseType: 'blob' }
    )
    var reader = new window.FileReader()
    reader.readAsDataURL(response.data)
    reader.onload = function () {
      setNodes(
        nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = {
              ...node.data,
              image: reader.result,
            }
          }
          return node
        })
      )
    }
  }

  return <Button onClick={onGenerate}>Generate</Button>
}

const CombinerNode = ({ id, data }) => {
  const store = useStoreApi()
  const { nodeInternals } = store.getState()
  const nodes = Array.from(nodeInternals.values())
  const weights = weightsForNodes(nodes, id)

  return (
    <Flex direction="column" align="center" gap="xs">
      <Flex gap="xs">
        {weights.map((w, i) => (
          <Badge
            key={i}
            style={{ background: nodes[i].data.color, color: 'black' }}
          >
            {nodes[i].id}: {(w * 100).toFixed(0)}%
          </Badge>
        ))}
      </Flex>
      <Image src={data.image} withPlaceholder width={200} height={200} />
      <GenerateButton nodeId={id} />
    </Flex>
  )
}

export default CombinerNode
