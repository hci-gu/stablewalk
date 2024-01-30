import { Group } from '@mantine/core'
import Sidebar from './sidebar.js'
import ReactFlow, { useNodesState } from 'reactflow'
import 'reactflow/dist/style.css'
import { nodesAtom } from './state.js'
import { useEffect } from 'react'
import { useAtomValue } from 'jotai'

const content = () => {
  const [nodes, setNodes, onNodeChange] = useNodesState(nodesAtom.init)
  const globalNodes = useAtomValue(nodesAtom)
  useEffect(() => {
    setNodes(globalNodes)
  }, [globalNodes])

  return (
    <>
      <Group>
        <Sidebar />
        <div style={{ height: '80vh', width: '60vw' }}>
          <ReactFlow nodes={nodes}></ReactFlow>
        </div>
      </Group>
    </>
  )
}

export default content

content.header = () => {
  return <div></div>
}
