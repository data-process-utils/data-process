import {JsonSearchEngine} from "@/lib/search-engine/json-engine";
import {SearchEngine} from "@/types/search-engine";

type SearchMode = "JSON" | "CSV" | "XML" | "XLS"


export class SearchEngineFactory {
    static createSearchEngine<T>(mode: SearchMode): SearchEngine<T> {
        switch (mode) {
            case "JSON":
                return new JsonSearchEngine<T>();
            default:
                throw new Error(`Unsupported search mode: ${mode}`);
        }
    }
}

