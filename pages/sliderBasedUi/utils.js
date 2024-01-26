export const getLocalStore = (key = 'Prompt') => {
  const local = localStorage.getItem(key)
  if (local) {
    return JSON.parse(local)
  }
  return []
}

export const setLocalStore = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const localStorageKeys = {
  prompt: 'Prompt',
  selectedPrompt: 'selectedPrompt',
}
