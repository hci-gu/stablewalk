import ReactFlow, {
  Background,
  Controls,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { seedAtom, settingsAtom } from '../../src/state'
import { Flex } from '@mantine/core'
import { useAtomValue } from 'jotai'
import { useRef, useState } from 'react'
import useWebSocket from './useWebsocket'
import PreviewNode from './PreviewNode'
import { makeUpdatesForChange, movePreviewNode } from './utils'
import PromptNode from './PromptNode'
import { initialNodes, newPromptNode } from './state'
import { AddPrompt } from '../../components/AddPrompt'
import { ClearButton } from '../../components/ClearButton'

const nodeTypes = {
  prompt: PromptNode,
  preview: PreviewNode,
}

const edgeTypes = {}

export default function Canvas() {
  const ref = useRef()
  const [instance, setInstance] = useState(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes())
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const seed = useAtomValue(seedAtom)
  const settings = useAtomValue(settingsAtom)
  const emit = useWebSocket()

  /* Events */
  const PaneMouseMov = ({ clientX, clientY }) => {
    if (!instance || !ref.current) return
    const bounds = ref.current.getBoundingClientRect()
    const position = instance.project({
      x: clientX - bounds.left,
      y: clientY - bounds.top,
    })
    setNodes((n) => movePreviewNode(n, position, settings, seed, emit))
  }

  const PaneClick = ({ clientX, clientY }) => {
    const bounds = ref.current.getBoundingClientRect()

    const position = instance.project({
      x: clientX - bounds.left,
      y: clientY - bounds.top,
    })

    setNodes((node) => [...node, newPromptNode(null, position.x, position.y)])

    console.log(bounds)
  }

  const NodesChange = (changes) => {
    onNodesChange(changes)
    setNodes((n) => makeUpdatesForChange(changes, n))
  }

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
          onNodesChange={(changes) => NodesChange(changes)}
          onPaneMouseMove={(ev) => PaneMouseMov(ev)}
          onPaneClick={(ev) => PaneClick(ev)}
          nodeOrigin={[0.5, 0.5]}
          fitView
          minZoom={0.01}
          maxZoom={20}
          connectionLineType="straight"
        >
          <Background />
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
