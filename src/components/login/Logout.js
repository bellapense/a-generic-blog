import React, {useEffect} from "react"
import {useAuth} from "../../contexts/AuthContext";
import {useHistory} from "react-router-dom";

export default function Logout() {
    const { logout } = useAuth()
    const history = useHistory()

    useEffect(() => {
        async function logoutHandler(){
            await logout()
            history.push('/login')
        }

        logoutHandler().catch(e => {
            console.error(e)
        })
    }, [])

    return <></>
}

