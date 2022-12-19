import { ActionIcon, Badge, Card, Flex, Text } from '@mantine/core'
import { IconX } from '@tabler/icons'
import { useReactFlow, useStoreApi } from 'reactflow'
import PromptImage from '../../components/PromptImage'

const PromptNode = ({ data }) => {
  return (
    <Card
      shadow="sm"
      p="xs"
      radius="md"
      withBorder
      style={{ overflow: 'visible' }}
    >
      <Flex direction="column" gap="xs">
        <Badge style={{ background: data.color, color: 'black' }} maw={200}>
          {data.prompts[0]}
        </Badge>
        <PromptImage {...data} />
      </Flex>
    </Card>
  )
}

export default PromptNode
