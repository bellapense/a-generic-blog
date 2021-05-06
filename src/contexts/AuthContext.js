import React, {useContext, useEffect, useState} from 'react';
import {auth} from '../services/firebase'

/* Create authentication context.  */
const AuthContext = React.createContext(false)

/* Export authentication context. */
export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading,setLoading] = useState(true)

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    const logout = async () => {
        await auth.signOut()
    }

    useEffect(() => {
        return auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })
    },[])


    const value = {
        currentUser,
        login,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
