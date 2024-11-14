import { isAxiosError } from "axios";
import { Note, NoteFormDate, Project, Task } from "../types";
import api from "@/lib/axios";

type NoteApiType = {
    formData: NoteFormDate,
    projectId: Project['_id'],
    taskId: Task['_id'],
    noteId: Note['_id']
}

export async function createNote({formData, projectId, taskId}: Pick<NoteApiType, 'formData' | 'projectId' | 'taskId'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}/note`;
        const { data } =  await api.post<string>(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteNote({projectId, taskId, noteId}: Pick<NoteApiType, 'projectId' | 'taskId' | 'noteId'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}/notes/${noteId}`;
        const { data } =  await api.delete<string>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}