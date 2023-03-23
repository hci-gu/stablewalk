import { Button, Card, Flex, NumberInput } from '@mantine/core'
import React, { useState } from 'react'
import { getBezierPath, useReactFlow, useStoreApi } from 'reactflow'
import { newImageNode } from './state'

const foreignObjectSize = 120
const valueFor = (from, to, i, steps) => from + (to - from) * (i / steps)

export default function SequenceEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  source,
  target,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })
  const instance = useReactFlow()
  const store = useStoreApi()
  const [steps, setSteps] = useState(10)

  const onClick = (event) => {
    event.stopPropagation()
    const { nodeInternals } = store.getState()
    const nodes = Array.from(nodeInternals.values())
    const sourceNode = nodes.find((n) => n.id === source)
    const targetNode = nodes.find((n) => n.id === target)

    const prompts = sourceNode.data.prompts
    const fromWeights = sourceNode.data.weights
    const toWeights = targetNode.data.weights

    const newNodes = [...new Array(steps)].map((_, i) => {
      const weights = fromWeights.map((fromValue, wi) => {
        return valueFor(fromValue, toWeights[wi], i + 1, steps + 1)
      })
      return newImageNode(prompts, weights, { x: 0, y: 0 })
    })
    instance.setNodes((nodes) => [...nodes, ...newNodes])
    instance.setEdges((edges) => edges.filter((e) => e.id !== id))
    instance.zoomTo(instance.getZoom())
  }

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <Card
          shadow="sm"
          p="xs"
          radius="md"
          withBorder
          style={{ transform: `scale(${1 / Math.max(instance.getZoom(), 1)})` }}
        >
          <Flex direction="column" gap="xs" align="center">
            <NumberInput w={80} value={steps} onChange={setSteps} />
            <Button onClick={(event) => onClick(event, id)}>create</Button>
          </Flex>
        </Card>
      </foreignObject>
    </>
  )
}
