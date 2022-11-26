import ReactFlow, { Background, Controls, useNodesState } from 'reactflow'
import 'reactflow/dist/style.css'
import { initialNodes, newCombinerNode, newPromptNode } from './state'
import { seedAtom, basePromptAtom } from '../../src/state'
import { Button, Flex, TextInput } from '@mantine/core'
import { useAtom } from 'jotai'

import CombinerNode from './CombinerNode'
import PromptNode from './PromptNode'
import { useState } from 'react'
import PromptImage from '../../components/PromptImage'

const nodeTypes = {
  prompt: PromptNode,
  combiner: CombinerNode,
  image: ({ data }) => {
    return <PromptImage {...data} width={40} height={40} />
  },
}

const AddPrompt = ({ setNodes }) => {
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
        onClick={() => setNodes((nodes) => [...nodes, newPromptNode(text)])}
      >
        Add prompt
      </Button>
    </Flex>
  )
}

const StartButton = ({ setNodes }) => {
  return (
    <Button
      onClick={() => {
        setNodes((nodes) => [
          ...nodes.map((node) => {
            if (node.type === 'prompt') {
              node.draggable = false
            }
            return node
          }),
          newCombinerNode(),
        ])
      }}
    >
      Start
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
      onChange={(e) => setSeed(e.target.value)}
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
