import {DataFilterRequest, SearchParams} from "@/types/search-engine";
import {SearchEngineFactory} from "@/lib/search-engine";


export async function filterData({targetData, params}: DataFilterRequest) {
    'use server'
    console.log('starting search engine process...')
    const result = await (await SearchEngineFactory.createSearchEngine('JSON').search(params, targetData))
    console.log('search engine result:', result)
    console.log('finished processing')
    return result
}
