
export interface Environment{
    put(name:string,value:any)
    get(name:string):any
}

export class BasicEnv implements Environment {
    values:Map<string,Object>=new Map()
    put(name:string,value:any){
        this.values.set(name,value);
    }
    get(name:string){
        return this.values.get(name);
    }
}