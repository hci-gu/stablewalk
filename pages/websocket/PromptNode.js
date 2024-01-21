import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Flex,
  Text,
  TextInput,
} from '@mantine/core'
import { initialNodes, newPromptNode } from './state'
import { useNodesState, useReactFlow } from 'reactflow'
import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { startedAtom } from '../../src/state'

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

const PromptNode = ({ data }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes())
  console.log(nodes)
  return (
    <Card
      shadow="sm"
      p="xs"
      radius="md"
      withBorder
      style={{ overflow: 'visible' }}
    >
      {data.prompts[0] ? (
        <Flex direction="column" gap="xs">
          <Badge style={{ background: data.color, color: 'black' }} maw={200}>
            {data.prompts[0]}
          </Badge>
        </Flex>
      ) : (
        <AddPrompt />
      )}
    </Card>
  )
}

export default PromptNode
