import { readdir, stat } from "fs/promises";
import { join } from "path";

export async function recursivelyReaddir(dirPath: string): Promise<string[]>
{
    const results: string[] = [];

    async function read(path: string) 
    {
        const files = await readdir(path);

        for (const file of files) 
        {
            const dir = join(path, file);
            if ((await stat(dir)).isDirectory()) 
                await read(dir);
            else 
                results.push(dir);
        }
    }
    await read(dirPath);

    return results;
}