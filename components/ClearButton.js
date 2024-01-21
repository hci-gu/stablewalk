import { Button } from "@mantine/core"
import { IconEraser } from "@tabler/icons"
import { useReactFlow } from "reactflow"
import { initialNodes } from "../pages/websocket/state"

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
