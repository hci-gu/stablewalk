export const getLocalStore = (key = 'Prompt') => {
  const local = localStorage.getItem(key)
  if (local) {
    return JSON.parse(local)
  }
  return []
}

export const setLocalStore = (key, value) => {
  const local = getLocalStore(key)

  if (local.length === 0) {
    localStorage.setItem(key, JSON.stringify([value]))
  } else {
    local.push(value)
    localStorage.setItem(key, JSON.stringify(local))
  }

  localStorage.setItem(key, JSON.stringify(local))
}

