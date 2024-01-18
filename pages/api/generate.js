// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs'
import path from 'path'
import sha1 from 'sha1'
import axios from 'axios'

const imgPath = path.join(process.cwd(), 'public', 'images')

const fileNameFor = (prompt, seed, steps, cfg, size) => {
  let name = `${prompt}-${seed}-${steps}-${cfg}-${size}`

  if (name.length > 200) {
    name = sha1(name)
  }

  return `${name}.jpg`
}

export default async function handler(req, res) {
  const { prompt, seed, steps, cfg, size } = req.body

  const fileName = fileNameFor(prompt, seed, steps, cfg, size)

  axios
    .post('http://130.241.23.151:4000/generate', req.body, {
      responseType: 'stream',
    })
    .then((response) => {
      response.data.pipe(fs.createWriteStream(path.join(imgPath, fileName)))
      response.data.on('end', () => {
        res.send(`/images/${fileName}`)
      })
    })
}
