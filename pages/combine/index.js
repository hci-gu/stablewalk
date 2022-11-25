import {
  ActionIcon,
  AspectRatio,
  Button,
  Card,
  Code,
  Flex,
  Image,
  NumberInput,
  SimpleGrid,
  Slider,
  Text,
  Textarea,
} from '@mantine/core'
import { IconPlus } from '@tabler/icons'
import axios from 'axios'
import { useControls } from 'leva'
import { useState } from 'react'

const convert = (p1, p2, sliderValue, basePrompt, seed) => {
  return {
    prompts: [
      `${p1}${basePrompt ? ', ' + basePrompt : ''}`,
      `${p2}${basePrompt ? ', ' + basePrompt : ''}`,
    ],
    weights: [(1 - sliderValue).toFixed(4), sliderValue.toFixed(4)],
    seed,
  }
}

const queryString = ({ prompts, weights, seed }) => {
  return `?prompts=${prompts.join('|')}&weights=${weights.join(
    ','
  )}&seed=${seed}`
}
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const valueFor = (from, to, i, steps) => from + (to - from) * (i / steps)

const InsertSteps = ({ callback }) => {
  const [steps, setSteps] = useState(1)

  return (
    <Flex direction="column" gap="xs" align="center">
      <NumberInput value={steps} onChange={setSteps} w={60} />
      <ActionIcon onClick={() => callback(steps)}>
        <IconPlus />
      </ActionIcon>
    </Flex>
  )
}

export default function Combine() {
  const [{ basePrompt, seed, steps, from, to }, set] = useControls(() => ({
    basePrompt: 'photograph, 4k',
    seed: { value: 34, step: 1 },
    steps: { value: 10, min: 1, max: 25, step: 1 },
    from: { value: 0, min: 0, max: 1, step: 0.001 },
    to: { value: 1, min: 0, max: 1, step: 0.001 },
  }))
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(0.5)
  const [prompt1, setPromp1] = useState('')
  const [prompt2, setPromp2] = useState('')
  const [images, setImages] = useState([])

  const onGenerateSequence = async () => {
    setImages([])
    for (let i = 0; i <= steps; i++) {
      const value = valueFor(from, to, i, steps)
      const body = convert(prompt1, prompt2, value, basePrompt, seed)
      const query = queryString(body)
      await wait(100)
      const response = await axios.get(`/api/image${query}`)
      setImages((images) => [
        ...images,
        {
          url: response.data,
          value,
        },
      ])
    }
  }

  const onGeneratePart = async () => {
    setEditing(false)
    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      if (!image.url) {
        const body = convert(prompt1, prompt2, image.value, basePrompt, seed)
        const query = queryString(body)
        await wait(100)
        const response = await axios.get(`/api/image${query}`)
        image.url = response.data
        setImages((images) => [...images])
      }
    }
  }

  const createGif = () => {
    const body = {
      images,
    }
    axios.post('/api/gif', body).then((response) => {
      console.log(response)
    })
  }

  const indentStepsAtIndex = (index, number) => {
    const updateImages = [...images]
    const fromValue = updateImages[index].value
    const toValue = updateImages[index + 1].value
    const newImages = [...new Array(number)].map((_, i) => {
      const value = valueFor(fromValue, toValue, i + 1, number + 1)
      return {
        value,
      }
    })
    updateImages.splice(index + 1, 0, ...newImages)
    setImages(updateImages)

    set({ steps: steps + number })
  }

  return (
    <div>
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 'sm', sm: 'lg' }}
        justify={{ sm: 'center' }}
        align={{ sm: 'center' }}
      >
        <Card shadow="sm" p="sm" radius="md" withBorder>
          <Textarea
            label="Prompt 1"
            placeholder="Write something"
            value={prompt1}
            onChange={(e) => setPromp1(e.target.value)}
          />
          <Button mt={8} w={'100%'}>
            Generate
          </Button>
        </Card>
        <Slider
          w={400}
          marks={[
            { value: 0.2, label: '20%' },
            { value: 0.5, label: '50%' },
            { value: 0.8, label: '80%' },
          ]}
          min={0}
          max={1}
          step={0.05}
          value={value}
          onChange={(value) => setValue(value)}
        />
        <Card shadow="sm" p="sm" radius="md" withBorder>
          <Textarea
            label="Prompt 2"
            placeholder="Write something"
            value={prompt2}
            onChange={(e) => setPromp2(e.target.value)}
          />
          <Button mt={8} w={'100%'}>
            Generate
          </Button>
        </Card>
      </Flex>
      <Flex
        mt={24}
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 'sm', sm: 'lg' }}
        justify={{ sm: 'center' }}
      >
        <Button onClick={() => onGenerateSequence()}>Generate sequence</Button>
        {editing ? (
          <Flex direction="column" gap="md">
            <Button variant="light" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button onClick={() => onGeneratePart()}>Generate part</Button>
          </Flex>
        ) : (
          <Button onClick={() => setEditing(!editing)}>Edit sequence</Button>
        )}
        <Button onClick={() => createGif()}>create GIF</Button>
      </Flex>
      <SimpleGrid
        mt={24}
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 'sm', sm: 'lg' }}
        justify={{ sm: 'center' }}
        cols={steps < 10 ? steps + 1 : 10}
      >
        {steps &&
          Array.from({ length: steps + 1 }, (_, i) => i).map((i) => (
            <Flex align="center" gap="md" w={'100%'}>
              <Flex direction="column" w={'100%'}>
                <Card shadow="sm" p="sm" radius="md" withBorder>
                  <Card.Section>
                    <AspectRatio ratio={1}>
                      <Image src={images[i]?.url} withPlaceholder />
                    </AspectRatio>
                  </Card.Section>
                </Card>
                <Text w={'100%'} align="center">
                  {images[i]?.value?.toFixed(4) ||
                    valueFor(from, to, i, steps).toFixed(2)}
                </Text>
              </Flex>
              {editing && (
                <InsertSteps
                  callback={(number) => indentStepsAtIndex(i, number)}
                />
              )}
            </Flex>
          ))}
      </SimpleGrid>

      <Code block>{JSON.stringify(images, null, 2)}</Code>
    </div>
  )
}
