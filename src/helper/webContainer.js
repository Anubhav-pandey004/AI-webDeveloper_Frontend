import { WebContainer } from '@webcontainer/api';

let WebContainerInstance = null;

export const getWebContainer = async() =>{
    if (WebContainerInstance === null) {
        WebContainerInstance = await WebContainer.boot();
        console.log("booted");
        
    }
    return WebContainerInstance;
}