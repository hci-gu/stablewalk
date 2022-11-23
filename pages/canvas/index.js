import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useStoreApi,
} from 'reactflow'
import 'reactflow/dist/style.css'
import {
  basePromptAtom,
  initialNodes,
  newCombinerNode,
  newPromptNode,
  seedAtom,
} from './state'
import { Button, Flex, TextInput } from '@mantine/core'
import { useAtom } from 'jotai'
import * as api from './api'

import CombinerNode from './CombinerNode'
import PromptNode from './PromptNode'
import ImageNode from './ImageNode'
import { useState } from 'react'
import { promiseSeries, promptsForNodes } from './utils'

const nodeTypes = {
  prompt: PromptNode,
  combiner: CombinerNode,
  image: ImageNode,
}

const AddPrompt = ({ setNodes }) => {
  const [basePrompt, setBasePrompt] = useAtom(basePromptAtom)
  const [seed] = useAtom(seedAtom)
  const [text, setText] = useState('')

  return (
    <Flex direction="column" gap="xs">
      <TextInput
        w={250}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Prompt"
      />
      <Button
        variant="light"
        onClick={async () => {
          const promptNode = newPromptNode(text)
          setNodes((nodes) => [...nodes, promptNode])
          const image = await api.getImage(
            [`${text}${basePrompt ? ', ' + basePrompt : ''}`],
            [1],
            seed
          )

          setNodes((nodes) =>
            nodes.map((node) => {
              if (node.id === promptNode.id) {
                node.data = {
                  ...node.data,
                  image,
                }
              }
              return node
            })
          )
        }}
      >
        Add prompt
      </Button>
    </Flex>
  )
}

const StartButton = ({ nodes, setNodes }) => {
  const [loading, setLoading] = useState(false)
  return (
    <Button
      onClick={async () => {
        const prompts = promptsForNodes(nodes)
        setLoading(true)

        setNodes((nodes) => [
          ...nodes.map((node) => {
            if (node.type === 'prompt') {
              node.draggable = false
            }
            return node
          }),
          newCombinerNode(),
        ])
        setLoading(false)
      }}
    >
      {loading ? 'Loading...' : 'Start'}
    </Button>
  )
}

const BasePromptInput = () => {
  const [value, setValue] = useAtom(basePromptAtom)
  return (
    <TextInput
      label="Prompt flair"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="example: photograph, headshot, 4k"
      w="40%"
    />
  )
}

const SeedInput = () => {
  const [seed, setSeed] = useAtom(seedAtom)

  return (
    <TextInput
      w={64}
      label="seed"
      value={seed}
      type="number"
      placeholder="empty for random"
      onChange={(e) => setSeed(parseInt(e.target.value))}
    />
  )
}

export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)

  return (
    <>
      <Flex gap="md" align="end">
        <AddPrompt setNodes={setNodes} />
        <BasePromptInput />
        <SeedInput />
        <StartButton nodes={nodes} setNodes={setNodes} />
      </Flex>
      <div
        style={{
          marginTop: 8,
          width: '95vw',
          height: '85vh',
        }}
      >
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={20}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </>
  )
}
