import { createContext, useCallback, useEffect, useState } from 'react'
import { baseUrl, postRequest } from '../utils/services'

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {

    // USER STATE 
    const [user, setUser] = useState(null)

    // LOGIN STATES 
    const [loginError, setLoginError] = useState(null)
    const [isLoginLoading, setIsLoginLoading] = useState(false)
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    // REGISTER STATES 
    const [registerError, setRegisterError] = useState(null)
    const [isRegisterLoading, setIsRegisterLoading] = useState(false)
    const [registerInfo, setRegisterInfo] = useState({
        name: '',
        email: '',
        password: ''
    })

    // USE EFFECT 
    useEffect(() => {
        const user = localStorage.getItem('User')
        setUser(JSON.parse(user))
    }, [])


    // REGISTER USER 
    const registerUser = useCallback(async (e) => {
        try {
            e.preventDefault()
            setIsRegisterLoading(true)
            setRegisterError(null)

            const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo))
            setIsRegisterLoading(false)

            if (response.error) return setRegisterError(response)

            localStorage.setItem("User", JSON.stringify(response))
            setUser(response)
        } catch (error) {
            console.log(error);
        }
    }, [registerInfo])


    // UPDATE REGISTRATION 
    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info)
    }, [])


    // LOGIN USER 
    const loginUser = useCallback(async (e) => {
        try {
            e.preventDefault()
            setIsLoginLoading(true)
            setLoginError(null)

            const response = await postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo))
            setIsLoginLoading(false)

            if (response.error) return setLoginError(response)

            localStorage.setItem("User", JSON.stringify(response))
            setUser(response)

        } catch (error) {
            console.log(error);
        }

    }, [loginInfo])


    // UPDATE LOGIN 
    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info)
    }, [])


    // LOGOUT USER 
    const logoutUser = useCallback(() => {
        localStorage.removeItem('User')
        setUser(null)
    }, [])


    return <AuthContext.Provider value={{
        updateLoginInfo,
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logoutUser,
        loginInfo,
        loginError,
        loginUser,
        isLoginLoading
    }}>
        {children}
    </AuthContext.Provider>
}