import {AbstractSearchEngine, SearchParams} from "@/lib/search-engine/search-engine";


export class JsonSearchEngine<T> extends AbstractSearchEngine<T> {


    async search(params: SearchParams[], file: string) {

        // const data = await this.read(file)
        console.log(` file content: ${file}`)
        // if (!isArray(target)) {
        //     if (this.isAllMatch(params, target)) {
        //         return target;
        //     }
        //     return {} as T
        // }
        // return target.filter((item) => this.search(params, item)) as T[]
        return {} as T
    }

}