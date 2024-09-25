import { getProjectsById } from "@/api/ProjectAPI";
import EditProjectForm from "@/components/projects/EditProjectForm";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom"

export default function EditProjectView() {

    const params = useParams();// Leemos los parametros
    const projectId = params.projectId!;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["editProject", projectId],//Agregando el id indico que es unico
        queryFn: () => getProjectsById(projectId),
        retry: false // Indica cuantas veces hara las consultas cuando encuentre error
    })

    if(isLoading) return "Cargando...";

    if(isError) return <Navigate to={'/404'} />

    if(data) return <EditProjectForm data={data} projectId={projectId} />
}
