import ReactFlow, {
  Background,
  Controls,
  Handle,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { seedAtom, settingsAtom, startedAtom } from '../../src/state'
import { Button, Flex, TextInput } from '@mantine/core'
import { useAtomValue } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { IconEraser } from '@tabler/icons'
import useWebSocket from './useWebsocket'
import PreviewNode from './PreviewNode'
import { makeUpdatesForChange, movePreviewNode } from './utils'
import PromptNode from './PromptNode'
import { initialNodes, newPromptNode } from './state'

const nodeTypes = {
  prompt: PromptNode,
  preview: PreviewNode,
}

const edgeTypes = {}

const AddPrompt = () => {
  const instance = useReactFlow()
  const [text, setText] = useState('')
  const started = useAtomValue(startedAtom)

  const onSubmit = (e) => {
    e.preventDefault()
    setText('')
    instance.setNodes((nodes) => [...nodes, newPromptNode(text)])
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
      }}
    >
      Clear
    </Button>
  )
}

export default function Canvas() {
  const ref = useRef()
  const [instance, setInstance] = useState(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes())
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const seed = useAtomValue(seedAtom)
  const settings = useAtomValue(settingsAtom)
  const emit = useWebSocket()

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <ReactFlow
          ref={ref}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onInit={(instance) => setInstance(instance)}
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => {
            onNodesChange(changes)
            setNodes((n) => makeUpdatesForChange(changes, n))
          }}
          onPaneMouseMove={({ clientX, clientY }) => {
            if (!instance || !ref.current) return
            const bounds = ref.current.getBoundingClientRect()
            const position = instance.project({
              x: clientX - bounds.left,
              y: clientY - bounds.top,
            })
            setNodes((n) => movePreviewNode(n, position, settings, seed, emit))
          }}
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
    </>
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
