import { apiClient } from '@/shared/api/apiClient'
import type { Note, NoteEntityType, CreateNoteDto } from '../model/types'

export const noteApi = {
  getNotes: async (entityType?: NoteEntityType) => {
    const res = await apiClient.get<Note[]>('/notes', {
      params: entityType ? { entityType } : undefined,
    })
    return res.data
  },

  getByEntity: async (type: NoteEntityType, id: string) => {
    const res = await apiClient.get<Note[]>(`/notes/entity/${type}/${id}`)
    return res.data
  },

  create: async (dto: CreateNoteDto) => {
    const res = await apiClient.post<Note>('/notes', dto)
    return res.data
  },

  delete: async (id: string) => {
    const res = await apiClient.delete(`/notes/${id}`)
    return res.data
  },
}
