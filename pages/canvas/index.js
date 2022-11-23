import ReactFlow, { Background, Controls, useNodesState } from 'reactflow'
import 'reactflow/dist/style.css'
import {
  basePromptAtom,
  initialNodes,
  newCombinerNode,
  newPromptNode,
} from './state'
import CombinerNode from './CombinerNode'
import PromptNode from './PromptNode'
import { Button, Flex, TextInput } from '@mantine/core'
import { useAtom } from 'jotai'

const nodeTypes = {
  prompt: PromptNode,
  combiner: CombinerNode,
}

const AddPromptButton = ({ setNodes }) => (
  <Button
    onClick={() => {
      setNodes((nodes) => [...nodes, newPromptNode()])
    }}
  >
    Add prompt
  </Button>
)

const AddCombinerButton = ({ setNodes }) => (
  <Button
    onClick={() => {
      setNodes((nodes) => [...nodes, newCombinerNode()])
    }}
  >
    Add combiner
  </Button>
)

const BasePromptInput = () => {
  const [value, setValue] = useAtom(basePromptAtom)
  return (
    <TextInput
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="base prompt ( example: photograph, headshot, 4k )"
      w="50%"
    />
  )
}

export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)

  return (
    <>
      <Flex gap="md">
        <AddPromptButton setNodes={setNodes} />
        <AddCombinerButton setNodes={setNodes} />
        <BasePromptInput />
      </Flex>
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
