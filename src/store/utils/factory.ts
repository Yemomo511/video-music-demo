import { StoreApi, create } from "zustand";
import {immer} from "zustand/middleware/immer"
import {persist,createJSONStorage} from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage";
export const stateFactory = <T,K>(state:T,action:(set:StoreApi<T>["setState"])=>K)=>{
    return create(
        //中间件，方便直接修改进行覆盖
        immer<T & K>((set)=>({
            ...state,
            //@ts-expect-error
            ...action(set)  
        }))
    )
}

export const statePersistFactory = <T, K>(
    name:string,
    state:T extends object ? T : never,
    action:(set:StoreApi<T>["setState"])=>K
)=>{
    const initItem = immer<T & K>(set=>({
        ...state,
        //@ts-expect-error
        ...action(set)
    }))
    return create(
        persist(initItem,{
            name:name,
            storage:createJSONStorage(()=>AsyncStorage)
        })
    )

}
