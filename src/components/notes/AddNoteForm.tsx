import { NoteFormDate } from "@/types/index"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createNote } from "@/api/NoteApi"
import { toast } from "react-toastify"
import { useLocation, useParams } from "react-router-dom"
import ErrorMessage from "../ErrorMessage"

export default function AddNoteForm() {

    const initialValue: NoteFormDate = {
        content: ''
    }

    // Obtener project Id
    const params = useParams();
    const projectId = params.projectId!

    // obtener query aram
    const location = useLocation();
    const queryParam = new URLSearchParams(location.search);
    const taskId = queryParam.get('viewTask')!

    const { register, handleSubmit, reset, formState: {errors} } = useForm({defaultValues: initialValue})

    const queryCliente = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: createNote,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (response) => {
            toast.success(response)
            reset();
            queryCliente.invalidateQueries({queryKey: ["task", taskId]})
        }
    })

    const handleAddNote = (formData: NoteFormDate) => {
        const data = {
            formData,
            projectId,
            taskId
        }
        mutate(data)
    }

    return (
        <form
            onSubmit={handleSubmit(handleAddNote)}
            className="space-y-3"
            noValidate
        >
            <div className="flex flex-col gap-2">
                <label htmlFor="content" className="font-bold">Crear Nota</label>
                <input type="text" id="content" placeholder="Contenido de la nota" className="w-full p-3 border border-gray-300" 
                    { ...register('content', {
                        required: 'El contentido de la nota es obligatorio'
                    }) }
                />
                {
                    errors.content && (
                        <ErrorMessage>{errors.content.message}</ErrorMessage>
                    )
                }
            </div>

            <input type="submit" value="Crear Nota" className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 text-white font-black cursor-pointer" />
        </form>
    )
}
