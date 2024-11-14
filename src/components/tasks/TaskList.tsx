import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Project, TaskProject, TaskStatus } from "@/types/index"
import TaskCard from "./TaskCard"
import { StatusTranslations } from "@/locales/es"
import DropTask from "./DropTask"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatus } from "@/api/TaskApi";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

type TaskListProps = {
    tasks: TaskProject[],
    canEdit: boolean
}

type GrouTask = {
    [key: string]: TaskProject[]
}

const initialStatusGroup: GrouTask = {
    pending: [],
    onHold: [],
    inProgess: [],
    underReview: [],
    completed: [],
}

// Indica que las llaves son string
const StatusStyles: {[key: string] : string} = {
    pending: 'border-t-slate-500',
    onHold: 'border-t-red-500',
    inProgess: 'border-t-blue-500',
    underReview: 'border-t-amber-500',
    completed: 'border-t-emerald-500',
}

export default function TaskList({tasks, canEdit}: TaskListProps) {
    
    // Obtener project Id
    const params = useParams();
    const projectId = params.projectId!

    const queryCliente = useQueryClient();
    // Actualizar estado
    const { mutate } = useMutation({
        mutationFn: updateStatus,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (response) => {
            queryCliente.invalidateQueries({queryKey: ["project", projectId]})
            toast.success(response)
        }
    });

    // Genera los grupos de tareas por estados
    const groupedTasks = tasks.reduce((acc, task) => {
        let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
        currentGroup = [...currentGroup, task]
        return { ...acc, [task.status]: currentGroup };
    }, initialStatusGroup);

    const handleDragEnd = (e: DragEndEvent) => {
        const { over, active } = e;

        if (over && over.id) {
            const taskId = active.id.toString();
            const status = over.id as TaskStatus;

            mutate({
                projectId,
                taskId,
                status
            })

            queryCliente.setQueryData(["project", projectId], (oldData: Project) => {
                const updatedTasks = oldData.tasks.map((task: TaskProject) => {
                    if (task._id === taskId) {
                        return {
                            ...tasks,
                            status
                        }
                    }

                    return task;
                });

                return {
                    ...oldData,
                    tasks: updatedTasks
                }
            })
        }
    }

    return (
        <>
            <h2 className="text-5xl font-black my-10">Tareas</h2>

            <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
                <DndContext onDragEnd={handleDragEnd}>
                    {Object.entries(groupedTasks).map(([status, tasks]) => (
                        <div key={status} className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5'>

                            <h3 className={`capitalize text-xl font-light border border-slate-300 p-3 bg-white border-t-8 ${StatusStyles[status]}`}>{StatusTranslations[status]}</h3>

                            <DropTask status={status} />

                            <ul className='mt-5 space-y-5'>
                                {tasks.length === 0 ? (
                                    <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                                ) : (
                                    tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit} />)
                                )}
                            </ul>
                        </div>
                    ))}
                </DndContext>
            </div>
        </>
    )
}
