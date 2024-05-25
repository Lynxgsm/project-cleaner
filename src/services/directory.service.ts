import { KEYS } from "../constants/keys";

export const getDefaultDirectories = () =>{
    const directories = localStorage.getItem(KEYS.STORAGE_DIRECTORIES);    
    return directories ? JSON.parse(directories): [];
}

export const addDefaultDirectory = (dir:string) =>{
    try {
        const directories = getDefaultDirectories();
        directories.push(dir);
        localStorage.setItem(
          KEYS.STORAGE_DIRECTORIES,
          JSON.stringify(directories)
        );
        return true;
    } catch (error) {
        if (error instanceof Error){
            console.error(error.message);
        }
        
        return false;
    }
}