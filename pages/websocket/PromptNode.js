import { ActionIcon, Badge, Card, Flex, Text } from '@mantine/core'

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
      </Flex>
    </Card>
  )
}

export default PromptNode
