import axios from 'axios'

export const getImage = async (prompts, weights, seed) => {
  const response = await axios.post(
    `http://leviathan.itit.gu.se:5000/combine`,
    { prompts, weights, seed },
    { responseType: 'blob' }
  )

  return new Promise((resolve) => {
    var reader = new window.FileReader()
    reader.readAsDataURL(response.data)
    reader.onload = function () {
      resolve(reader.result)
    }
  })
}
