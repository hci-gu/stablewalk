import allColors from 'nice-color-palettes'
const colors = allColors[0]

let id = 1
const getId = () => `${id++}`

export const imageSize = 100

export const newImageNode = (prompt = '', { x, y }) => {
  const id = getId()
  return {
    id,
    type: 'image',
    data: {
      prompt,
      weights: [1],
      color: colors[parseInt(id) % colors.length],
    },
    position: { x, y },
  }
}

export const fillBoundsWithNodes = (bounds) => {
  const { x: xOffset, y: yOffset, width, height } = bounds
  const layout = []

  // Calculate how many components can fit in a row and a column
  const rows = Math.floor(width / imageSize)
  const cols = Math.floor(height / imageSize)
  console.log()

  // Loop over each row and column position
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Calculate the x and y position for each component
      const xPos = xOffset + col * imageSize
      const yPos = yOffset + row * imageSize

      // Add the position to the layout array
      layout.push(newImageNode('', { x: xPos, y: yPos }))
    }
  }

  return layout
}
