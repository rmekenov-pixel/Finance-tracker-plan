export type NoteEntityType = 'GENERAL' | 'TRANSACTION' | 'GOAL'

export interface Note {
  id: string
  userId: string
  content: string
  entityType: NoteEntityType
  entityId?: string
  createdAt: string
}

export interface CreateNoteDto {
  content: string
  entityType?: NoteEntityType
  entityId?: string
}
