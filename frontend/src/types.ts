export interface Story {
  id: number
  title: string
  content: string
  department: string
  createdAt: string
}

export type NewStory = Omit<Story, 'id' | 'createdAt'>
