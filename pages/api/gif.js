// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import fs from 'fs'
import path from 'path'

// path to image folder
const basePath = path.join(process.cwd(), 'public')

export default async function handler(req, res) {
  const images = req.body.images

  images.forEach((image, i) => {
    const fileName = `img-${i}.jpg`
    const filePath = path.join(basePath, 'frames', fileName)
    // copy image to folder
    fs.copyFileSync(path.join(basePath, image), filePath)
  })

  res.send('OK')
}
