import {JsonSearchEngine} from "@/lib/search-engine/json-engine";
import {SearchEngine} from "@/types/search-engine";
import {FileType} from "@/types/files";



export class SearchEngineFactory {
    static createSearchEngine<T>(type: FileType): SearchEngine<T> {
        switch (type) {
            case "JSON":
                return new JsonSearchEngine<T>();
            default:
                throw new Error(`Unsupported search of type: ${type}`);
        }
    }
}

