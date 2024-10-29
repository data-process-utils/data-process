import {AbstractSearchEngine, SearchParams} from "@/types/search-engine";
import {isArray} from "@/lib/objects";


export class JsonSearchEngine<T> extends AbstractSearchEngine<T> {


    search(params: SearchParams[], target: T[] | T): T[] | T {
        if (!isArray(target)) {
            if (this.isAllMatch(params, target)) {
                return target;
            }
            return {} as T
        }
        return target.filter((item) => this.search(params, item)) as T[]
    }

}