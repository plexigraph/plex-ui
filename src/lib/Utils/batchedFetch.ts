import { sleep } from "../Utils/sleep"
type QueueItem = {
  url: string
  signal: AbortSignal
  resolve: (res: Response) => void
}
const queue: QueueItem[] = []

let currentlyFetching = false

export async function batchedFetch(
  url: string,
  signal: AbortSignal
): Promise<Response | undefined> {
  return await new Promise(resolve => {
    queue.push({
      url,
      signal,
      resolve,
    })
    if (!currentlyFetching) {
      loop()
    }
  })
}

async function asEachResolves<T>(
  values: Promise<T>[],
  onResolve: (item: T) => void
): Promise<T[]> {
  const results = await Promise.all(values)
  values.forEach(async item => onResolve(await item))
  return results
}

export function getCurrentlyFetching() {
  return currentlyFetching
}

async function loop() {
  currentlyFetching = true
  async function onResolve() {
    if (queue.length == 0) {
      currentlyFetching = false
      return
    }
    fetchWithErrorHandling(queue.shift()!).then(onResolve)
  }
  const batch = queue.splice(0, 20)
  asEachResolves(
    batch.map(req => fetchWithErrorHandling(req)),
    onResolve
  )
}

async function fetchWithErrorHandling(item: QueueItem) {
  const { url, signal, resolve } = item
  try {
    const res = await fetch(url, { signal })
    resolve(res)
  } catch (e) {
    if (item.signal.aborted) return
    console.error(e)
    await sleep(1) // wait a second to let other async things get processed
    fetchWithErrorHandling(item)
  }
}
