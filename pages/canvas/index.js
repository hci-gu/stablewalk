import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  useNodesState,
  useReactFlow,
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

const nodeTypes = {
  prompt: PromptNode,
  combiner: CombinerNode,
  image: ({ data }) => {
    return <PromptImage {...data} />
  },
}

const AddPrompt = () => {
  const instance = useReactFlow()
  const [text, setText] = useState('')
  const started = useAtomValue(startedAtom)

  const onSubmit = (e) => {
    e.preventDefault()
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
          nodes={nodes}
          onInit={(instance) => setInstance(instance)}
          onNodesChange={(changes) => {
            onNodesChange(changes)
            setNodes((n) => makeUpdatesForChange(changes, n))
          }}
          nodeTypes={nodeTypes}
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
          nodeOrigin={[0.5, 0.5]}
          fitView
          minZoom={0.01}
          maxZoom={20}
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
        {/* <SaveButton /> */}
        <ClearButton />
      </Flex>
    </Flex>
  )
}
