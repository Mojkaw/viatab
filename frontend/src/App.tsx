import { useState, useEffect } from 'react'
import { Story, NewStory } from './types'
import { fetchStories, createStory, updateStory, deleteStory } from './api'

const DEPARTMENTS = ['Software Engineering', 'Business Administration', 'Nursing']

const styles: Record<string, React.CSSProperties> = {
  app: { fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto', padding: 24 },
  tabs: { display: 'flex', gap: 8, marginBottom: 24 },
  form: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 },
  input: { padding: 8, fontSize: 14, borderRadius: 4, border: '1px solid #d1d5db' },
  formActions: { display: 'flex', gap: 8 },
  stories: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: { border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 },
  cardActions: { display: 'flex', gap: 8, marginTop: 12 },
  empty: { color: '#6b7280' },
}

function btn(bg: string): React.CSSProperties {
  return { padding: '8px 16px', background: bg, color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }
}

function App() {
  const [stories, setStories] = useState<Story[]>([])
  const [activeTab, setActiveTab] = useState(DEPARTMENTS[0])
  const [form, setForm] = useState<NewStory>({ title: '', content: '', department: DEPARTMENTS[0] })
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => { fetchStories().then(setStories) }, [])

  const filtered = stories.filter(s => s.department === activeTab)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId !== null) {
      const updated = await updateStory(editingId, form)
      setStories(prev => prev.map(s => s.id === editingId ? updated : s))
      setEditingId(null)
    } else {
      const created = await createStory({ ...form, department: activeTab })
      setStories(prev => [created, ...prev])
    }
    setForm({ title: '', content: '', department: activeTab })
  }

  const handleEdit = (story: Story) => {
    setEditingId(story.id)
    setForm({ title: story.title, content: story.content, department: story.department })
  }

  const handleDelete = async (id: number) => {
    await deleteStory(id)
    setStories(prev => prev.filter(s => s.id !== id))
  }

  const handleTabChange = (dept: string) => {
    setActiveTab(dept)
    setForm({ title: '', content: '', department: dept })
    setEditingId(null)
  }

  return (
    <div style={styles.app}>
      <h1>VIA Tabloid</h1>

      <div style={styles.tabs}>
        {DEPARTMENTS.map(dept => (
          <button key={dept} onClick={() => handleTabChange(dept)}
            style={btn(activeTab === dept ? '#1a56db' : '#6b7280')}>
            {dept}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input style={styles.input} placeholder="Title" required
          value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <textarea style={styles.input} placeholder="Content" required rows={3}
          value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
        <div style={styles.formActions}>
          <button type="submit" style={btn('#16a34a')}>
            {editingId !== null ? 'Update Story' : 'Add Story'}
          </button>
          {editingId !== null && (
            <button type="button" style={btn('#6b7280')}
              onClick={() => { setEditingId(null); setForm({ title: '', content: '', department: activeTab }) }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {filtered.length === 0 ? (
        <p style={styles.empty}>No stories yet in {activeTab}.</p>
      ) : (
        <div style={styles.stories}>
          {filtered.map(story => (
            <div key={story.id} style={styles.card}>
              <h3 style={{ margin: '0 0 8px' }}>{story.title}</h3>
              <p style={{ margin: '0 0 8px', color: '#374151' }}>{story.content}</p>
              <small style={{ color: '#9ca3af' }}>{new Date(story.createdAt).toLocaleString()}</small>
              <div style={styles.cardActions}>
                <button onClick={() => handleEdit(story)} style={{ ...btn('#f59e0b'), padding: '4px 12px' }}>Edit</button>
                <button onClick={() => handleDelete(story.id)} style={{ ...btn('#ef4444'), padding: '4px 12px' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
