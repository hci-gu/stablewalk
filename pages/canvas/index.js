import { Badge, Button, Card, Flex, Image, Text, Textarea } from '@mantine/core'
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useReactFlow,
  useStoreApi,
} from 'reactflow'
import 'reactflow/dist/style.css'
import allColors from 'nice-color-palettes'
import axios from 'axios'
const colors = allColors[0]
const basePrompt = ', photograph, 4k, detailed'

const initalNodes = [
  {
    id: '1',
    type: 'input',
    data: {
      label: 'Prompt 1',
      prompt: 'Rose',
      color: colors[0],
    },
    position: { x: 100, y: 100 },
  },
  {
    id: '2',
    type: 'input',
    data: {
      label: 'Prompt 2',
      prompt: 'Cheese',
      color: colors[1],
    },
    position: { x: 800, y: 100 },
  },
  {
    id: '3',
    type: 'input',
    data: {
      label: 'Prompt 3',
      prompt: 'House',
      color: colors[3],
    },
    position: { x: 400, y: 800 },
  },
  {
    id: '4',
    type: 'marker',
    position: { x: 450, y: 450 },
    data: {},
  },
]

const InputNode = ({ data, xPos, yPos, id }) => {
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
    <Card>
      <Text>
        {xPos}, {yPos}
      </Text>
      <Textarea
        label={data.label}
        value={data.prompt}
        onChange={(e) => onPromptChange(e.target.value)}
      />
    </Card>
  )
}

const promptsAndWeightsFromNodes = (nodes) => {
  const promptNodes = nodes.filter((n) => n.type === 'input')
  const positions = promptNodes.map((n) => [n.position.x, n.position.y])
  const markerPos = nodes.find((n) => n.type === 'marker').position

  const distances = positions.map(([x, y]) =>
    1 / Math.hypot(markerPos.x - x, markerPos.y - y)
  )

  const totalDistance = distances.reduce((a, b) => a + b, 0)
  const weights = distances.map((d) => d / totalDistance)

  return [promptNodes.map((n) => `${n.data.prompt}${basePrompt}`), weights]
}

const MarkerNode = ({ id, data }) => {
  const store = useStoreApi()
  const { nodeInternals } = store.getState()
  const nodes = Array.from(nodeInternals.values())
  const [, weights] = promptsAndWeightsFromNodes(nodes)
  const sum = weights.reduce((a, b) => a + b, 0)

  return (
    <Flex direction={{ base: 'column' }} gap="xs">
      <Flex direction={{ base: 'row' }} gap="xs">
        {weights.map((w, i) => (
          <Badge
            key={i}
            style={{ background: nodes[i].data.color, color: 'black' }}
          >
            {nodes[i].id}: {w.toFixed(3)}
          </Badge>
        ))}
        <Badge>{sum}</Badge>
      </Flex>
      <Image src={data.image} withPlaceholder width={200} height={200} />
      <GenerateButton nodeId={id} />
    </Flex>
  )
}

const nodeTypes = {
  input: InputNode,
  marker: MarkerNode,
}

const GenerateButton = ({ nodeId }) => {
  const { setNodes } = useReactFlow()
  const store = useStoreApi()
  const onGenerate = async () => {
    const { nodeInternals } = store.getState()
    const nodes = Array.from(nodeInternals.values())

    const [prompts, weights] = promptsAndWeightsFromNodes(nodes)
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

export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initalNodes)

  return (
    <>
      <div style={{ width: '85vw', height: '80vh' }}>
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </>
  )
}
