import NewPasswordForm from "@/components/auth/NewPassowordForm"
import NewPasswordToken from "@/components/auth/NewPasswordToken"
import { useState } from "react"

export default function NewPasswordView() {

    const [isValidToken, setIsValidToken] = useState(false)

    return (
        <>
            <h1 className="text-5xl font-black text-white">Reestablecer Password</h1>
            <p className="text-2xl font-light text-white mt-5">
                Ingresa el código que resivistes {''}
                <span className=" text-fuchsia-500 font-bold"> por email</span>
            </p>

            {!isValidToken ? <NewPasswordToken /> : <NewPasswordForm />}
        </>
    )
}
