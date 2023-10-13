import {statePersistFactory} from '../utils/factory';

//待补充
export interface StoryType {
  id: string;
  title: string;
  content: string;
}
const initState= {
    storyList: [] as StoryType[],
}
export const useStoryStore = statePersistFactory("storyList",initState,(set)=>({
    addStory:(story:StoryType)=>{
        set(state=>{
            state.storyList.push(story)
        })
    },
    removeStory:(id:string)=>{
        set((state)=>{
            state.storyList.splice(
                1,
                state.storyList.findIndex((item)=>item.id = id)
            )
        })
    },
    clearStory:()=>{
        set((state)=>{
            state.storyList = []
        })
    }
}));
