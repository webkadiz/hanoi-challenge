export function range(start, end = null, step = null) {
  const array = []

  if (end === null) {
    for (let i = 0; i < start; i++) array.push(i)
  } else if (step === null) {
    for (let i = start; i < end; i++) array.push(i)
  } else {
    if (step === 0) {
      throw new Error("step(arg 3) must not be zero")
    } else if (step < 0) {
      for (let i = start; i > end; i += step) array.push(i)
    } else if (step > 0) {
      for (let i = start; i < end; i += step) array.push(i)
    }
  }

  return array
}

export function float(num) {
  return parseFloat(num)
}

export function createWebSocket(route) {
  return new WebSocket(`ws://localhost:8081/${route}`)
}
