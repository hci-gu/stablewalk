// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import sha1 from 'sha1'

// path to image folder
const imgPath = path.join(process.cwd(), 'public', 'images')

const fileNameFor = (prompts, weights, seed, neg_prompt, steps, cfg, v2) => {
  const promptString = prompts.join('-')
  const weightString = weights.join('-')

  let name = `${promptString}-${weightString}-${neg_prompt}-${seed}-${steps}-${cfg}-${v2}`

  if (name.length > 200) {
    name = sha1(name)
  }

  return `${name}.png`
}

export default async function handler(req, res) {
  const { weights, seed, basePrompt, neg_prompt, steps, cfg, v2 } = req.body
  const prompts =
    req.body.prompts?.map(
      (p) => `${p}${basePrompt ? `, ${basePrompt}` : ''}`
    ) || []
  const fileName = fileNameFor(
    prompts,
    weights,
    seed,
    neg_prompt,
    steps,
    cfg,
    v2
  )

  const body = {
    prompts,
    weights,
    seed,
    neg_prompt,
    steps,
    cfg,
    v2,
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
    .then((response) => {
      response.data.pipe(fs.createWriteStream(path.join(imgPath, fileName)))
      response.data.on('end', () => {
        res.send(`/images/${fileName}`)
      })
    })
}
