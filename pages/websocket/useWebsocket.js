import { useSetAtom } from 'jotai'
import { useEffect, useState, useCallback } from 'react'
import { imageAtom } from './state'

let currentMessage = null
let prevMessage = null

const useWebSocket = () => {
  const setImage = useSetAtom(imageAtom)
  const [ws, setWs] = useState(null)

  // Initialize WebSocket connection
  useEffect(() => {
    const webSocket = new WebSocket('ws://130.241.23.151:1338')

    webSocket.onopen = () => {
      console.log('WebSocket Connected')
    }

    webSocket.onclose = () => {
      console.log('WebSocket Disconnected')
    }

    webSocket.onmessage = (event) => {
      setImage(event.data)
    }

    setWs(webSocket)

    let sendInterval = setInterval(() => {
      if (currentMessage && currentMessage !== prevMessage) {
        // console.log(currentMessage)
        webSocket.send(JSON.stringify(currentMessage))
        prevMessage = currentMessage
      }
    }, 100)

    return () => {
      webSocket.close()
      clearInterval(sendInterval)
    }
  }, [])

  // Function to send messages
  const sendMessage = useCallback(
    (message) => {
      if (ws) {
        currentMessage = message
      }
    },
    [ws]
  )

  return sendMessage
}

export default useWebSocket
