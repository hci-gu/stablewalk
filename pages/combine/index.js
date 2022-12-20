import {
  ActionIcon,
  AspectRatio,
  Button,
  Card,
  Code,
  Container,
  Flex,
  Image,
  NumberInput,
  SimpleGrid,
  Slider,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core'
import { IconPlus } from '@tabler/icons'
import axios from 'axios'
import { useAtom, useAtomValue } from 'jotai'
import { useControls } from 'leva'
import { useState } from 'react'
import ImageModal from '../../components/ImageModal'
import PromptImage from '../../components/PromptImage'
import { sequenceAtom } from '../../src/state'

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
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const imageToKey = ({ weights }) => `${weights.join('-')}`

const valueFor = (from, to, i, steps) => from + (to - from) * (i / steps)

const InsertSteps = ({ index }) => {
  const [{ images }, setSequence] = useAtom(sequenceAtom)
  const [steps, setSteps] = useState(1)

  const indentSteps = () => {
    const updateImages = [...images]
    const prompts = updateImages[index].prompts
    const fromWeights = updateImages[index].weights
    const toWeights = updateImages[index + 1].weights
    const newImages = [...new Array(steps)].map((_, i) => {
      const weights = fromWeights.map((fromValue, wi) => {
        return valueFor(fromValue, toWeights[wi], i + 1, steps + 1)
      })
      return {
        prompts,
        weights,
      }
    })
    updateImages.splice(index, 0, ...newImages)
    setSequence((s) => ({
      ...s,
      images: updateImages,
      steps: s.steps + steps,
    }))
  }

  return (
    <Flex direction="column" gap="xs" align="center">
      <NumberInput value={steps} onChange={setSteps} w={60} />
      <ActionIcon onClick={() => indentSteps()}>
        <IconPlus />
      </ActionIcon>
    </Flex>
  )
}

export default function Combine() {
  const [{ images, editing }, setSequence] = useAtom(sequenceAtom)

  return (
    <div>
      <ImageModal />
      <SimpleGrid
        mt={24}
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 'sm', sm: 'lg' }}
        justify={{ sm: 'center' }}
        cols={images.length < 8 ? images.length + 1 : 8}
      >
        {images.map((image, i) => (
          <Flex gap="md" align="center">
            {editing && (
              <>
                {i > 0 && <InsertSteps index={i} />}
                {i === 0 && <Container w={80} />}
              </>
            )}
            <SequenceImage
              {...image}
              name={`Step ${i}`}
              key={`Sequence_prompt_${imageToKey(image)}`}
              editing={editing}
            />
          </Flex>
        ))}
      </SimpleGrid>
    </div>
  )
}

const SequenceImage = (image) => {
  return (
    <Flex direction="column" justify="center" align="center">
      {image.editing && <Text>{image.name}</Text>}
      <PromptImage
        {...image}
        width={image.fill ? '100%' : 120}
        height={image.fill ? '100%' : 120}
      />
      {image.editing && (
        <Text fz={12}>{image.weights.map((w) => w.toFixed(3)).join(', ')}</Text>
      )}
    </Flex>
  )
}

const StepsInput = () => {
  const [{ steps }, setSequence] = useAtom(sequenceAtom)
  return (
    <NumberInput
      w={80}
      type="number"
      value={steps}
      onChange={(value) => setSequence((s) => ({ ...s, steps: value }))}
      label="Steps"
    />
  )
}

const GenerateButton = () => {
  const [{ from, to, steps, images }, setSequence] = useAtom(sequenceAtom)
  const onGenerate = () => {
    const newImages = [...new Array(steps + 1)].map((_, i) => {
      const weights = from.weights.map((w, wi) => {
        return valueFor(w, to.weights[wi], i, steps)
      })
      return {
        prompts: from.prompts,
        weights,
      }
    })
    setSequence((s) => ({ ...s, images: newImages }))
  }

  return (
    <Button onClick={() => onGenerate()} color={images.length ? 'red' : 'blue'}>
      {images.length ? 'Regenerate' : 'Generate'}
    </Button>
  )
}

const EditingButton = () => {
  const [{ editing }, setSequence] = useAtom(sequenceAtom)

  return (
    <Button onClick={() => setSequence((s) => ({ ...s, editing: !editing }))}>
      {editing ? 'Done' : 'Edit sequence'}
    </Button>
  )
}

const ClearButton = () => {
  const [, setSequence] = useAtom(sequenceAtom)

  return (
    <Button
      onClick={() => setSequence((s) => ({ ...s, images: [] }))}
      color="red"
    >
      Clear
    </Button>
  )
}

Combine.Header = function () {
  const { from, to } = useAtomValue(sequenceAtom)

  return (
    <Flex w="100%" gap="md" align="center">
      {from && <SequenceImage {...from} name="from" />}
      <StepsInput />
      {to && <SequenceImage {...to} name="to" />}
      <Flex direction="column" gap="md">
        <EditingButton />
        <GenerateButton />
        <ClearButton />
      </Flex>
    </Flex>
  )
}
