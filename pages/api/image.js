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
  const basePrompt = req.query.basePrompt || null
  const prompts =
    req.query.prompts
      ?.split('|')
      .map((p) => `${p}${basePrompt ? `, ${basePrompt}` : ''}`) || []
  const weights = req.query.weights?.split(',').map((w) => parseFloat(w)) || []
  const neg_prompt = req.query.negPrompt || ''
  const seed = parseInt(req.query.seed) || 0
  const steps = parseInt(req.query.steps) || 20
  const cfg = parseFloat(req.query.cfg) || 7.5
  const v2 = req.query.v2 || true

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
