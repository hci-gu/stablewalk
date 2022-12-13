import ReactFlow, { Background, Controls, useNodesState } from 'reactflow'
import 'reactflow/dist/style.css'
import { initialNodes, newCombinerNode, newPromptNode } from './state'
import { seedAtom, basePromptAtom, settingsAtom } from '../../src/state'
import { Button, Checkbox, Flex, TextInput } from '@mantine/core'
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
  const [started, setStarted] = useState(false)

  return (
    <Button
      color={started ? 'red' : 'blue'}
      onClick={() => {
        if (!started) {
          setNodes((nodes) => [
            ...nodes.map((node) => {
              if (node.type === 'prompt') {
                node.draggable = false
              }
              return node
            }),
            newCombinerNode(),
          ])
        } else {
          setNodes(initialNodes)
        }
        setStarted(!started)
      }}
    >
      {started ? 'Restart' : 'Start'}
    </Button>
  )
}

const BasePromptInput = () => {
  const [{ basePrompt }, set] = useAtom(settingsAtom)
  return (
    <TextInput
      label="Prompt flair"
      value={basePrompt}
      onChange={(e) => set({ basePrompt: e.target.value })}
      placeholder="example: poorly drawn hands"
    />
  )
}

const NegPromptInput = () => {
  const [{ negPrompt }, set] = useAtom(settingsAtom)
  return (
    <TextInput
      label="Negative prompt"
      value={negPrompt}
      onChange={(e) => set({ negPrompt: e.target.value })}
      placeholder="example: photograph, headshot, 4k"
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

const V2Checkbox = () => {
  const [{ v2 }, set] = useAtom(settingsAtom)

  return (
    <Checkbox
      label="v2"
      checked={v2}
      onChange={(e) => set({ v2: e.target.checked })}
    />
  )
}

const CFGInput = () => {
  const [{ cfg }, set] = useAtom(settingsAtom)

  return (
    <TextInput
      w={64}
      label="cfg"
      value={cfg}
      type="number"
      onChange={(e) => set({ cfg: parseFloat(e.target.value) })}
    />
  )
}

const StepsInput = () => {
  const [{ steps }, set] = useAtom(settingsAtom)

  return (
    <TextInput
      w={64}
      label="steps"
      value={steps}
      type="number"
      onChange={(e) => set({ steps: parseInt(e.target.value) })}
    />
  )
}

export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)

  return (
    <>
      <Flex gap="md" align="end">
        <AddPrompt setNodes={setNodes} />
        <Flex direction="column" w="40%">
          <BasePromptInput />
          <NegPromptInput />
        </Flex>
        <Flex direction="column">
          <Flex align="end" gap="md">
            <CFGInput />
            <StepsInput />
          </Flex>
          <Flex align="end" gap="md">
            <SeedInput />
            <V2Checkbox />
          </Flex>
        </Flex>
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
