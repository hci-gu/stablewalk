import { Badge, Card, Flex } from '@mantine/core'
import PromptImage from '../../components/PromptImage'

const PromptNode = ({ data }) => {
  return (
    <Card shadow="sm" p="xs" radius="md" withBorder>
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
