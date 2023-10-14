import { stateFactory } from "../utils/factory";
import { Dimensions } from 'react-native';
interface deviceType {
    orientation: 'portrait' | 'landscape',
}
const initState = {
    orientation: 'portrait' as 'portrait' | 'landscape',
}
interface api {
    setState: (newState: deviceType) => void,
}
export const useDeviceStore = stateFactory<deviceType,api>(initState,(set)=>{
    return{
        setState:(newState:deviceType)=>{
            set((state)=>({
                ...state,
                ...newState
            }))
        },
    }
})