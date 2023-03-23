import ReactFlow, {
  Background,
  Controls,
  Handle,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStore,
} from 'reactflow'
import 'reactflow/dist/style.css'
import {
  initialNodes,
  loadFlowState,
  newPromptNode,
  saveFlowState,
} from './state'
import { startedAtom } from '../../src/state'
import { Button, Flex, TextInput } from '@mantine/core'
import { useAtomValue } from 'jotai'

import CombinerNode from './CombinerNode'
import PromptNode from './PromptNode'
import { useEffect, useRef, useState } from 'react'
import PromptImage from '../../components/PromptImage'
import {
  addImageNodeForPosition,
  makeUpdatesForChange,
  moveCombinerNode,
  updateNodesForZoom,
} from './utils'
import ImageModal from '../../components/ImageModal'
import { IconEraser } from '@tabler/icons'
import SequenceEdge from './SequenceEdge'

const nodeTypes = {
  prompt: PromptNode,
  combiner: CombinerNode,
  image: ({ data, ...props }) => {
    const instance = useReactFlow()
    const connectionNodeId = useStore((s) => s.connectionNodeId)
    const isTarget = connectionNodeId && connectionNodeId !== data.id
    const targetSize = 25 / instance.getZoom()
    const sourceSize = 10 / instance.getZoom()

    return (
      <>
        <Handle
          type="target"
          position="left"
          id="sequence-target"
          style={{
            background: isTarget ? '#C3423F' : 'rgba(0, 0, 0, 0)',
            width: isTarget ? targetSize : 5,
            height: isTarget ? targetSize : 5,
            marginLeft: isTarget ? -targetSize / 2 : 0,
          }}
        />
        <Handle
          type="source"
          position="right"
          id="sequence-source"
          style={{
            width: sourceSize,
            height: sourceSize,
            marginRight: -sourceSize / 2,
          }}
        />
        <PromptImage {...data} />
      </>
    )
  },
}

const edgeTypes = {
  sequence: SequenceEdge,
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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes())
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    const savedState = loadFlowState()
    if (savedState) {
      setNodes(savedState.nodes)
    }
  }, [])

  return (
    <>
      <ImageModal />
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
          onEdgesChange={(changes) => {
            onEdgesChange(changes)
          }}
          onConnect={(params) => {
            setEdges(() => addEdge({ ...params, type: 'sequence' }, []))
          }}
          onMove={(e, { zoom }) => {
            setNodes((n) => updateNodesForZoom(n, zoom))
          }}
          onPaneClick={({ clientX, clientY }) => {
            if (!instance || !ref.current) return
            const bounds = ref.current.getBoundingClientRect()
            const position = instance.project({
              x: clientX - bounds.left,
              y: clientY - bounds.top,
            })
            setNodes((n) =>
              addImageNodeForPosition(n, position, instance.getZoom())
            )
            setTimeout(() => saveFlowState(instance), 100)
          }}
          onPaneMouseMove={({ clientX, clientY }) => {
            if (!instance || !ref.current) return
            const bounds = ref.current.getBoundingClientRect()
            const position = instance.project({
              x: clientX - bounds.left,
              y: clientY - bounds.top,
            })
            setNodes((n) => moveCombinerNode(n, position))
          }}
          // defaultViewport={{
          //   zoom: 0.5,
          // }}
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
