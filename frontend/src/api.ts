import { Story, NewStory } from './types'

const BASE = '/api/stories'

export async function fetchStories(): Promise<Story[]> {
  const res = await fetch(BASE)
  return res.json()
}

export async function createStory(story: NewStory): Promise<Story> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(story),
  })
  return res.json()
}

export async function updateStory(id: number, story: NewStory): Promise<Story> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(story),
  })
  return res.json()
}

export async function deleteStory(id: number): Promise<void> {
  await fetch(`${BASE}/${id}`, { method: 'DELETE' })
}
