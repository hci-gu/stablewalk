import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import ReactFlow, { useNodesState } from 'reactflow'
import 'reactflow/dist/style.css'
import {
  POSITION_DEBUGGER_TYPE,
  distanceBetweenPositioNodesAtom,
  isDistanceOver500Atom,
  nodesAtom,
  positionNodesAtom,
} from './state'
import { use, useEffect } from 'react'
import { Card, Flex, Text } from '@mantine/core'

const PositionDebugger = (props) => {
  const { xPos, yPos } = props
  return (
    <div>
      <pre>{JSON.stringify({ x: xPos, y: yPos }, null, 2)}</pre>
    </div>
  )
}

const nodeTypes = {
  [POSITION_DEBUGGER_TYPE]: PositionDebugger,
}

const Flow = () => {
  const setOurNodes = useSetAtom(nodesAtom)
  const [nodes, setNodes, onNodesChange] = useNodesState([
    { id: '0', position: { x: 100, y: 100 }, data: { label: '1' } },
    {
      id: '1',
      position: { x: 200, y: 200 },
      data: { label: '1' },
      type: POSITION_DEBUGGER_TYPE,
    },
    {
      id: '3',
      position: { x: 100, y: 100 },
      data: { label: '1' },
      type: POSITION_DEBUGGER_TYPE,
    },
  ])

  useEffect(() => {
    setOurNodes(nodes)
  }, [nodes])

  // const [nodes, setNodes] = useAtom(nodesAtom)

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypes}
    ></ReactFlow>
  )
}

export default Flow

const OnOff = () => {
  const isOn = useAtomValue(isDistanceOver500Atom)

  return <div>{isOn ? 'On' : 'Off'}</div>
}

Flow.Header = () => {
  const nodes = useAtomValue(positionNodesAtom)
  const distance = useAtomValue(distanceBetweenPositioNodesAtom)

  return (
    <div>
      <h1>Flow</h1>
      <Flex>
        {nodes.map((node) => (
          <Card>
            <Text>
              {node.id} - {node.type}
            </Text>
            <Text>
              <pre>{JSON.stringify(node.position, null, 2)}</pre>
            </Text>
          </Card>
        ))}
      </Flex>
      <Text>Distance: {distance}</Text>
      <OnOff />
    </div>
  )
}
