import {SearchParams} from "@/lib/search-engine/search-engine";
import {SearchEngineFactory} from "@/lib/search-engine";
import {FileType} from "@/types/files";


export async function filterData({file, filetype, params}: {
    file: string,
    filetype: FileType,
    params: SearchParams[]
}) {
    'use server'
    console.log('starting search engine process...')
    const result = SearchEngineFactory.createSearchEngine(filetype).search(params, file)
    console.log('search engine result:', result)
    console.log('finished processing')
    return result
}
