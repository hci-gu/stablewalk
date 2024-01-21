import { Badge, Flex, Image } from '@mantine/core'
import { useReactFlow, useStoreApi } from 'reactflow'
import 'reactflow/dist/style.css'
import { useAtomValue } from 'jotai'
import { imageAtom } from './state'

const PreviewNode = () => {
  const instance = useReactFlow()
  const image = useAtomValue(imageAtom)
  const imageSrc = `data:image/jpeg;base64,${image}`
  //   const store = useStoreApi()
  //   const { nodeInternals } = store.getState()
  //   const nodes = Array.from(nodeInternals.values())

  const zoom = Math.max(instance.getZoom(), 1)

  return (
    <Flex gap={4} mb={160 + 64 / zoom} direction="column">
      <Image src={imageSrc} width={256} height={256} />
      {/* <Flex gap={4} justify="center">
        {weights.map((w, i) => (
          <Badge
            key={i}
            size={100 / zoom}
            h={40 / zoom}
            fz={16 / zoom}
            p={8 / zoom}
            style={{
              background: nodes[i].data.color,
              color: 'black',
              pointerEvents: 'none',
            }}
          >
            {(w * 100).toFixed(0)}%
          </Badge>
        ))}
      </Flex> */}
    </Flex>
  )
}

export default PreviewNode
