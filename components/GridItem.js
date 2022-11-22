import { Button, Card, Image, Text } from '@mantine/core'

export default ({ item, onClick }) => {
  return (
    <Card shadow="sm" p="sm" radius="md" withBorder style={{ height: 200 }}>
      <Card.Section>
        <Text
          size="sm"
          p="xs"
          weight={500}
          pos="absolute"
          style={{ zIndex: 1 }}
        >
          {item.cfg}, {item.steps}
        </Text>
        <Image
          src={item.image}
          height={item.image ? 200 : 140}
          withPlaceholder
        />
      </Card.Section>
      {!item.image && (
        <Button
          variant="light"
          color="blue"
          fullWidth
          mt="sm"
          radius="md"
          onClick={onClick}
        >
          Get Image
        </Button>
      )}
    </Card>
  )
}
