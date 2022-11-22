import {
  Button,
  Card,
  Flex,
  Image,
  Slider,
  Textarea,
  TextInput,
} from '@mantine/core'
import axios from 'axios'
import { useControls } from 'leva'
import { useState } from 'react'

const convert = (p1, p2, sliderValue) => {
  return {
    prompts: [p1, p2],
    weights: [1 - sliderValue, sliderValue],
  }
}

export default function Combine() {
  const { basePrompt } = useControls({ basePrompt: '' })
  const [value, setValue] = useState(0.5)
  const [prompt1, setPromp1] = useState('')
  const [prompt2, setPromp2] = useState('')
  const [image, setImage] = useState(null)

  const onGenerate = async () => {
    const params = convert(
      `${prompt1}${basePrompt}`,
      `${prompt2}${basePrompt}`,
      value
    )
    const response = await axios.post(
      `http://leviathan.itit.gu.se:5000/combine`,
      params,
      { responseType: 'blob' }
    )
    var reader = new window.FileReader()
    reader.readAsDataURL(response.data)
    reader.onload = function () {
      setImage(reader.result)
    }
    // encode png raw data

    // response.data is an image, set it as the src of an image
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
        </Card>
      </Flex>
      <Flex
        mt={24}
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 'sm', sm: 'lg' }}
        justify={{ sm: 'center' }}
      >
        <Button onClick={() => onGenerate()}>Generate</Button>
      </Flex>
      {/* {toQueryString(convert(prompt1, prompt2, value))} */}
      <Flex
        mt={24}
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 'sm', sm: 'lg' }}
        justify={{ sm: 'center' }}
      >
        <Card shadow="sm" p="sm" radius="md" withBorder w={600}>
          <Card.Section>
            <Image src={image} height={512} width={512} withPlaceholder />
          </Card.Section>
        </Card>
      </Flex>
    </div>
  )
}
