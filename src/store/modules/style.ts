import { stateFactory } from "../utils/factory";
import { Dimensions } from 'react-native';
interface deviceType {
    deviceWidth: number,
    deviceHeight: number,
}
const initState = {
    deviceWidth: Dimensions.get('window').width,
    deviceHeight: Dimensions.get('window').height,
}
export const useDeviceStore = stateFactory(initState,(set)=>{
    return{
        setState:(newState:deviceType)=>{
            set((state)=>({
                ...state,
                ...newState
            }))
        },
    }
})