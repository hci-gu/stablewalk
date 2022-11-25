// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import fs from 'fs'
import path from 'path'

// path to image folder
const imgPath = path.join(process.cwd(), 'public', 'images')

const fileNameFor = (prompts, weights, seed) => {
  const promptString = prompts.join('-')
  const weightString = weights.join('-')
  return `${promptString}-${weightString}-${seed}.png`
}

export default async function handler(req, res) {
  const prompts = req.query.prompts?.split('|') || []
  const weights = req.query.weights?.split(',').map((w) => parseFloat(w)) || []
  const seed = parseInt(req.query.seed) || 0

  const fileName = fileNameFor(prompts, weights, seed)

  const body = {
    prompts,
    weights,
    seed,
  }

  // // check if image exists
  if (fs.existsSync(path.join(imgPath, fileName))) {
    res.send(`/images/${fileName}`)
    return
  }

  axios
    .post('http://leviathan.itit.gu.se:5000/combine', body, {
      responseType: 'stream',
    })
    .then((response) =>
      response.data.pipe(fs.createWriteStream(`${imgPath}/${fileName}`))
    )
    .then(() => res.send(`/images/${fileName}`))
}
