import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ProjectForm from "@/components/projects/ProjectForm";
import { ProjectFormData } from "@/types/index";
import { createProject } from "@/api/ProjectAPI";

export default function CreateProjectView() { 

    const navigate = useNavigate();
    const initialValue: ProjectFormData = {
        projectName: "",
        clientName: "",
        description: ""
    };
    const { register, handleSubmit, formState: {errors} } = useForm({defaultValues: initialValue});

    // Mutacion para registrar proyecto
    const mutation = useMutation({
        mutationFn: createProject, // Metodo para crear el proyecto
        onError: (error) => {
            toast.error(error.message);// Recuperar el error
        },
        onSuccess: (response) => { // data  es la respuesta  del metodo
            toast.success(response);
            navigate('/')
        }
    })

    const handleForm = async (data: ProjectFormData) => {
        await mutation.mutateAsync(data)
    }

    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-black">
                    Crear Proyecto
                </h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para crear un proyecto</p>

                <nav className="my-5">
                    <Link className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold curs
                    transition-colors" 
                    to={'/'}>
                        Volver a Proyectos
                    </Link>
                </nav>

                <form className="mt-10 bg-white shadow-lg p-10 rounded-lg" onSubmit={handleSubmit(handleForm)} noValidate>

                    <ProjectForm 
                        register={register}
                        errors={errors}
                    />

                    <input type="submit" value="Crear Proyecto" className="bg-fuchsia-600 w-full p-3 text-white uppercase font-bold hover: hover:bg-fuchsia-700 cursor-pointer transition-colors" />

                </form>
            </div>
        </>
    )
}