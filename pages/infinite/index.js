import ReactFlow, {
  Controls,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { fillBoundsWithNodes, imageSize, newImageNode } from './state'
import { startedAtom } from '../../src/state'
import { Button, Flex, TextInput } from '@mantine/core'
import { useAtomValue } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { IconEraser } from '@tabler/icons'

const nodeTypes = {
  image: ({ data, ...props }) => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16)

    return (
      <div
        style={{
          width: imageSize,
          height: imageSize,
          backgroundColor: data.color,
        }}
      ></div>
    )
  },
}

const AddPrompt = () => {
  const instance = useReactFlow()
  const [text, setText] = useState('')
  const started = useAtomValue(startedAtom)

  const onSubmit = (e) => {
    e.preventDefault()
    setText('')
    instance.setNodes((nodes) => [...nodes, newPromptNode(text)])
    setTimeout(() => saveFlowState(instance), 100)
  }

  return (
    <form onSubmit={onSubmit}>
      <Flex direction="column" gap="xs">
        <TextInput
          w={250}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Prompt"
          disabled={started}
        />
        <Button variant="light" onClick={onSubmit} disabled={started}>
          Add prompt
        </Button>
      </Flex>
    </form>
  )
}

export const ClearButton = () => {
  const instance = useReactFlow()

  return (
    <Button
      leftIcon={<IconEraser />}
      color="red"
      onClick={() => {
        instance.setNodes(initialNodes())
        setTimeout(() => saveFlowState(instance), 100)
      }}
    >
      Clear
    </Button>
  )
}

export default function Canvas() {
  const ref = useRef()
  const [instance, setInstance] = useState(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  //   useEffect(() => {
  //     setNodes((n) => [...n, newImageNode('hello', { x: 0, y: 0 })])
  //   }, [])

  console.log(nodes)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <ReactFlow
        ref={ref}
        nodeTypes={nodeTypes}
        edgeTypes={{}}
        onInit={(instance) => setInstance(instance)}
        nodes={nodes}
        edges={edges}
        onMove={() => {
          const bounds = ref.current.getBoundingClientRect()
          console.log(bounds)

          setNodes(fillBoundsWithNodes(bounds))
        }}
        snapGrid={[50, 50]}
        nodeOrigin={[0.5, 0.5]}
        fitView
        minZoom={0.01}
        maxZoom={20}
        connectionLineType="straight"
      >
        {/* <Background /> */}
        <Controls />
      </ReactFlow>
    </div>
  )
}

Canvas.Header = function () {
  return (
    <Flex w="100%" gap="md">
      <AddPrompt />
      <Flex gap="md" direction="column">
        <ClearButton />
      </Flex>
    </Flex>
  )
}
