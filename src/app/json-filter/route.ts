import {filterData} from "@/services/filter-data.service";
import {DataFilterRequest} from "@/lib/search-engine/search-engine";


export async function POST(request: Request) {
    const data = await request.json() as DataFilterRequest
    const filteredData = await filterData(data)
    await new Promise(r => setTimeout(r, 2000));
    const encoder = new TextEncoder()
    return new Response(encoder.encode(JSON.stringify(filteredData)))
}