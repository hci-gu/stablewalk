import { Badge, Card, Flex, Image } from '@mantine/core'

const PromptNode = ({ data }) => {
  return (
    <Card shadow="sm" p="xs" radius="md" withBorder>
      <Flex direction="column" gap="xs">
        <Badge style={{ background: data.color, color: 'black' }}>
          {data.prompt}
        </Badge>
        <Image
          src={data.image}
          alt={data.prompt}
          width={200}
          height={200}
          withPlaceholder
        />
      </Flex>
    </Card>
  )
}

export default PromptNode
