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

  return `${name}.jpg`
}

export default async function handler(req, res) {
  const { weights, seed, basePrompt, neg_prompt, steps, cfg, v2, size } =
    req.body
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
    size,
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
    size,
  }

  // mock
  // res.send(`/images/1d8abd09f15eeb8b950e095f1d36dbb31cc568b9.png`)
  // return

  // // check if image exists
  // if (fs.existsSync(path.join(imgPath, fileName))) {
  //   res.send(`/images/${fileName}`)
  //   return
  // }
  console.log(body)

  axios.post('http://130.241.23.151:4000/combine', body).then((response) => {
    res.send(response.data)
  })

  /*
  axios.post('http://130.241.23.151:4000/combine', body).then((response) => {
    let received = new Date().getTime()
    const { image, ...timestamps } = response.data
    fs.writeFileSync(path.join(imgPath, fileName), image, 'base64')
    let file_written = new Date().getTime()
    console.log(file_written)
    res.send({
      image: `/images/${fileName}`,
      timestamps: {
        ...timestamps,
        received,
        file_written: file_written - received,
      },
    })
    // response.data.on('end', () => {
    //   res.send(`/images/${fileName}`)
    // })
  })
  */
}
