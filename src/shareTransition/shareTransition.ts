import { SharedTransition, withSpring, withTiming } from 'react-native-reanimated';
import style from '../common/style';
const shareVideoTrans = SharedTransition.custom((values) => {
    'worklet';
    return {
      width: withTiming(values.targetWidth),
      height: withTiming(values.targetHeight),
      originY: withTiming(values.currentOriginY)
    };
  })
  export {shareVideoTrans}