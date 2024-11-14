import { z } from 'zod'

// Auth
const authSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    current_password: z.string(),
    password: z.string(),
    password_confirmation: z.string(),
    token: z.string(),
})

type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, 'email' | 'password'>
export type UserRegistrationForm = Pick<Auth, 'name' | 'email' | 'password' | 'password_confirmation'>
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>
export type ForgotPasswordForm = Pick<Auth, 'email'>
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>
export type UpdateCurrentUserPasswordForm = Pick<Auth, 'current_password' | 'password' | 'password_confirmation'>
export type CheckPasswordForm = Pick<Auth, 'password'>

export type ConfirmToken = Pick<Auth, 'token'>

// User
export const userSchema = authSchema.pick({
    name: true,
    email: true
}).extend({
    _id: z.string()
})
export type User = z.infer<typeof userSchema>
export type UserProfileForm = Pick<User, 'name' | 'email'>


export const taskStatusSchema = z.enum(["pending" , "onHold" , "inProgess" , "underReview" , "completed"])
export type TaskStatus = z.infer<typeof taskStatusSchema>


/* Notess */
const noteSchema = z.object({
    _id:  z.string(),
    content:  z.string(),
    createdBy:  userSchema,
    task: z.string(),
    createdAt: z.string()
})

export type Note = z.infer<typeof noteSchema>
export type NoteFormDate = Pick<Note, 'content'>;

export const taskSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    project: z.string(),
    status: taskStatusSchema,
    completedBy: z.array(z.object({
        _id: z.string(),
        user: userSchema,
        status: taskStatusSchema
    })),
    notes: z.array(noteSchema.extend({
        createdBy: userSchema
    })),
    createdAt: z.string(),
    updatedAt:  z.string()
});

export const taskProjectSchema = taskSchema.pick({
    _id: true,
    name: true,
    description: true,
    status: true
})

export type Task = z.infer<typeof taskSchema>
export type TaskFormData = Pick<Task, 'name' | 'description'>
export type TaskProject = z.infer<typeof taskProjectSchema>

// Projects
// Esquema para proyectos
export const projectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
    manager: z.string(userSchema.pick({_id: true})),
    tasks: z.array(taskProjectSchema),
    team: z.array(z.string(userSchema.pick({_id: true})))
});

// Creamos un esquema para project
export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        _id: true,
        projectName: true,
        clientName: true,
        description: true,
        manager: true
    })
)

export const editProjectSchema = projectSchema.pick({
    projectName: true,
    clientName: true,
    description: true,
})
export type Project = z.infer<typeof projectSchema>; // Creamos el type en base al esquema

// Selecciono que campos del type quiero almacenar en un nuevo type
export type ProjectFormData = Pick<Project, 'clientName' | 'projectName' | 'description'>

// Task
// name
// description
// project
// status

/* Team */
const teamMemberSchema = userSchema.pick({
    name: true,
    email: true,
    _id: true
})
export const teamMembersSchema = z.array(teamMemberSchema)
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type TeamMemberForm = Pick<TeamMember, 'email'>