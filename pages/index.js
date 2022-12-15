import { useState, useEffect, useCallback } from 'react'
import { useControls } from 'leva'
import { SimpleGrid } from '@mantine/core'
import GridItem from '../components/GridItem'

const getInitialGrid = (size) => {
  const grid = []
  for (let i = 0; i < size; i++) {
    grid.push([])
    for (let j = 0; j < size; j++) {
      grid[i].push({
        cfg: 4 + (j * 16) / (size - 1),
        steps: parseInt(4 + i * 96 / (size - 1)),
        image: undefined,
      })
    }
  }
  return grid
}

const useGrid = (size) => {
  const { cfg, prompt } = useControls({
    cfg: { value: 7.5, step: 0.5 },
    prompt: 'a man with hat riding a bike, mantisse',
  })
  const [grid, setGrid] = useState(getInitialGrid(size))
  useEffect(() => {
    setGrid(getInitialGrid(size))
  }, [size])

  console.log({ cfg, prompt })

  const addImage = useCallback(
    (i, j) => {
      const newGrid = [...grid]
      const item = newGrid[i][j]
      item.image = `http://leviathan.itit.gu.se:5000/img/${prompt}?cfg=${item.cfg}&steps=${item.steps}&seed=214`
      setGrid(newGrid)
    },
    [grid, prompt]
  )

  return [grid, addImage]
}

export default function Home() {
  const { size } = useControls({
    size: { value: 5, min: 5, max: 20, step: 1 },
  })
  const [grid, getImage] = useGrid(size)

  return (
    <>
      <SimpleGrid cols={size}>
        {grid.map((row, i) =>
          row.map((item, j) => (
            <GridItem
              item={item}
              key={`Item_${i}-${j}`}
              onClick={() => getImage(i, j)}
            />
          ))
        )}
      </SimpleGrid>
    </>
  )
}
