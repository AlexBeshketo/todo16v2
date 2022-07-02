import {Dispatch} from "redux";
import {setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../../../app/app-reducer";
import {authAPI, LoginResponseType} from "../../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {Simulate} from "react-dom/test-utils";


const initialState: InitialStateType = {
    isLoggedIn: false
}

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'AUTH/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.isLoggedIn}
        // case 'APP/SET-ERROR':
        //     return {...state, error: action.error}
        default:
            return state
    }
}

export type InitialStateType = {
    isLoggedIn: boolean
}

export const setIsLoggedInAC = (isLoggedIn: boolean) => ({
    type: 'AUTH/SET-IS-LOGGED-IN',
    isLoggedIn
} as const)

export const loginTC = (loginResponse: LoginResponseType) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(loginResponse)
        .then((res) => {
            if (res.data.resultCode==0) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC("succeeded"))
            } else {
                handleServerAppError(res.data,dispatch)
            }
        })
        .catch(error=> {
            handleServerNetworkError(error,dispatch)
        })
}

export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logOut()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

type setIsLoggedInACType = ReturnType<typeof setIsLoggedInAC>

type ActionsType = setIsLoggedInACType | SetAppStatusActionType | SetAppErrorActionType
