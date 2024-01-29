import { Button, Collapse, Flex, TextInput } from '@mantine/core'
import { useAtomValue, useSetAtom } from 'jotai'
import { promptsAtom } from '../state'
import { useEffect, useState } from 'react'
// import { useDisclosure } from '@mantine/hooks'

export const NewPrompt = () => {
  const [prompt, setPrompt] = useState('')
  const setPrompts = useSetAtom(promptsAtom)
  const prompts = useAtomValue(promptsAtom)
  // const [opend, { toggle }] = useDisclosure(false)
  // const [oppositePrompt, setOppositePrompt] = useState('')

  const isLableUnique = (label) => {
    let temp = true
    prompts.map((p) => {
      if (p.label === label) {
        // console.log('not unique')
        temp = false
      }
    })
    return temp
  }

  const getUniqueId = (array) => {
    // console.log(array)
    if (array.length > 0) {
      return array[array.length - 1].id + 1
    }
    // console.log(array.length)
    return 1
  }

  const isDisabled = () => {
    const isUnique = isLableUnique(prompt)
    // console.log('is the lable unique:', isUnique)
    if (isUnique === false || prompt.length === 0) {
      // console.log('Disable button')
      return true
    } else {
      return false
    }
  }

  const addAndReset = (e) => {
    e.preventDefault()

    // if (oppositePrompt === '') {
    setPrompts((s) => [...s, { id: getUniqueId(s), label: prompt, weight: 0 }])
    // } else {
    //   setPrompts((s) => [
    //     ...s,
    //     {
    //       id: getUniqueId(s),
    //       label: prompt,
    //       opposingPrompt: oppositePrompt,
    //       weight: 0,
    //     },
    //   ])
    // }
    // setOppositePrompt('')
    setPrompt('')
  }

  return (
    <>
      <form onSubmit={(e) => addAndReset(e)}>
        <Flex w={'100%'} gap={8}>
          <TextInput
            w={'100%'}
            placeholder="Hat or fluffy fur"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button type="submit" disabled={isDisabled() == true}>
            Add
          </Button>
          {/* <Button onClick={toggle}></Button> */}
        </Flex>
        {/* <Flex w={'100%'}>
          <Collapse in={opend}>
            <TextInput
              pt={8}
              placeholder="An opposing prompt"
              value={oppositePrompt}
              onChange={(e) => {
                setOppositePrompt(e.target.value)
              }}
            />
          </Collapse>
        </Flex> */}
      </form>
    </>
  )
}
