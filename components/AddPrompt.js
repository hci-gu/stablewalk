import { Button, Flex, TextInput } from "@mantine/core"
import { useAtomValue } from "jotai"
import { startedAtom } from "../src/state"
import { useState } from "react"
import { useReactFlow } from "reactflow"
import { newPromptNode } from "../pages/websocket/state"

export const AddPrompt = () => {
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
