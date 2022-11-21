import { useState, useEffect, useCallback } from 'react'
import styles from '../styles/Home.module.css'
import Image from 'next/image'

const getInitialGrid = () => {
  const grid = []
  for (let i = 0; i < 10; i++) {
    grid.push([])
    for (let j = 0; j < 10; j++) {
      grid[i].push({
        cfg: 4 + j * 16 / 10,
        steps: 10 + i * 5,
        image: undefined,
      })
    }
  }
  return grid
}

const prompt = "a man with hat riding a bike, mantisse"

const useGrid = () => {
  const [grid, setGrid] = useState(getInitialGrid())

  const addImage = useCallback((i, j) => {
    const newGrid = [...grid]
    const item = newGrid[i][j]
    item.image = `http://leviathan.itit.gu.se:5000/img/${prompt}?cfg=${item.cfg}&steps=${item.steps}&seed=214`
    setGrid(newGrid)
  }, [grid])

  return [grid, addImage]
}

export default function Home() {
  const [images, setImages] = useState([])
  const [cfg, setCfg] = useState(7.5)

  const [grid, getImage] = useGrid()

  const addImage = useCallback(() => {
    setCfg(cfg + 0.5)
    setImages([...images, `http://leviathan.itit.gu.se:5000/img/${prompt}?cfg=${cfg}&seed=213`])
  }, [images, cfg])

  const width = 100
  const height = 100
  return (
    <div className={styles.container}>
      { grid.map((row, i) => (
        <div key={`row_${i}`} style={{ whiteSpace: 'nowrap', display: 'flex' }}>
          { row.map((cell, j) => (
            <div key={`cell_${i}_${j}`} style={{ display: 'inline-block', width: width, height: height, position: 'relative' }}>
              { cell.image && <img src={cell.image} width={width} height={height} /> }
              { !cell.image && <button onClick={() => getImage(i, j)}>+</button> }
            </div>
          ))}
        </div>
      ))}

    </div>
  )
}
