import ReactFlow, { Background, Controls, useNodesState } from 'reactflow'
import 'reactflow/dist/style.css'
import { initialNodes, newCombinerNode, newPromptNode } from './state'
import { seedAtom, settingsAtom, startedAtom } from '../../src/state'
import { Button, Checkbox, Flex, TextInput } from '@mantine/core'
import { useAtom, useAtomValue } from 'jotai'

import CombinerNode from './CombinerNode'
import PromptNode from './PromptNode'
import { useRef, useState } from 'react'
import PromptImage from '../../components/PromptImage'
import {
  addImageNodeForPosition,
  makeUpdatesForChange,
  moveCombinerNode,
  updateNodesForZoom,
} from './utils'

const nodeTypes = {
  prompt: PromptNode,
  combiner: CombinerNode,
  image: ({ data }) => {
    return <PromptImage {...data} />
  },
}

const AddPrompt = ({ setNodes }) => {
  const [text, setText] = useState('')
  const started = useAtomValue(startedAtom)

  const onSubmit = (e) => {
    e.preventDefault()
    setNodes((nodes) => [...nodes, newPromptNode(text)])
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

const StartButton = ({ setNodes }) => {
  const [started, setStarted] = useAtom(startedAtom)

  return (
    <Button
      color={started ? 'red' : 'blue'}
      onClick={() => {
        if (!started) {
          setNodes((nodes) => [...nodes, newCombinerNode()])
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
  const ref = useRef()
  const [instance, setInstance] = useState(null)
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
