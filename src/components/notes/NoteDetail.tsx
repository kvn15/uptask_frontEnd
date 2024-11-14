import { deleteNote } from "@/api/NoteApi"
import { useAuth } from "@/hooks/useAuth"
import { Note } from "@/types/index"
import { formatDate } from "@/utils/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type NoteProps = {
  note: Note
}

export default function NoteDetail({note}:NoteProps) {

  const { data, isLoading } = useAuth();
  const canDelete = useMemo(() => data?._id === note.createdBy._id, [data])

  // Obtener project Id
  const params = useParams();
  const projectId = params.projectId!

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search)
  const taskId = queryParams.get('viewTask')!

  const queryCliente = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (response) => {
      toast.success(response)
      queryCliente.invalidateQueries({queryKey: ["task", taskId]})
    }
  })

  if (isLoading) return 'Cangando...';

  return (
    <div className="p-3 flex justify-between items-center">
      <div>
        <p>
          {note.content} por: <span className="font-bold">{note.createdBy.name}</span>
        </p>
        <p className="text-xs text-slate-500">
          {formatDate(note.createdAt)}
        </p>
      </div>

      {canDelete && (
        <button type="button" className="bg-red-400 p-2 hover:bg-red-500 text-xs text-white font-bold cursor-pointer transition-colors"
        onClick={() => mutate({projectId, taskId, noteId: note._id})}
        >Eliminar</button>
      )}
    </div>
  )
}
