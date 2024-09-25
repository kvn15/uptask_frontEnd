import { getProjectsById } from "@/api/ProjectAPI";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskList from "@/components/tasks/TaskList";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useNavigate, useParams } from "react-router-dom"

export default function ProjectDetailsView() {

    const navigate = useNavigate()
    const params = useParams();// Leemos los parametros
    const projectId = params.projectId!;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["project", projectId],//Agregando el id indico que es unico
        queryFn: () => getProjectsById(projectId),
        retry: false // Indica cuantas veces hara las consultas cuando encuentre error
    })

    if(isLoading) return "Cargando...";

    if(isError) return <Navigate to={'/404'} />

    if(data) return (
        <>
            <h1 className="text-5xl font-black">{data.projectName}</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">{data.description}</p>

            <nav className="my-5 flex gap-3">
                <button
                    type="button"
                    className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                    onClick={() => navigate('?newTask=true')}
                >
                    Agregar Tarea
                </button>
            </nav>

            <TaskList 
                tasks={data.tasks}
            />
            <AddTaskModal />
            <EditTaskData />
            <TaskModalDetails />
        </>
    )
}
