import { Image } from '@mantine/core'
import { useState } from 'react'

const ImageNode = ({ data }) => {
  const [toggled, setToggle] = useState(false)
  return (
    <Image
      radius="md"
      src={data.image}
      onClick={() => setToggle(!toggled)}
      withPlaceholder
      style={{
        cursor: 'pointer',
        marginLeft: toggled ? -256 : 0,
        marginTop: toggled ? -256 : 0,
      }}
      width={toggled ? 512 : 40}
      height={toggled ? 512 : 40}
    />
  )
}

export default ImageNode
