import { useEffect, useState, useCallback } from 'react'

const useWebSocket = () => {
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

    // let sendInterval = setInterval(() => {
    //   if (currentMessage && currentMessage !== prevMessage) {
    //     console.log(currentMessage)
    //     webSocket.send(JSON.stringify(currentMessage))
    //     prevMessage = currentMessage
    //   }
    // }, 100)

    return () => {
      webSocket.close()
      //   clearInterval(sendInterval)
    }
  }, [])

  // Function to send messages
  const sendMessage = useCallback(
    async (message) => {
      return new Promise((resolve, reject) => {
        if (ws) {
          ws.send(JSON.stringify(message))
          ws.onmessage = (event) => {
            resolve(event.data)
          }
        } else {
          reject('WebSocket not initialized')
        }
      })
    },
    [ws]
  )

  return sendMessage
}

export default useWebSocket
