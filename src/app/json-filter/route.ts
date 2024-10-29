import {filterData} from "@/services/json-filter.service";
import {DataFilterRequest} from "@/types/search-engine";

// import {req} from "agent-base";

export async function POST(request: Request) {
    const data = await request.json() as DataFilterRequest
    // console.log(params[0].field)
    const filteredData = await filterData(data)
    await new Promise(r => setTimeout(r, 2000));
    const encoder = new TextEncoder()
    return new Response(encoder.encode(JSON.stringify(filteredData)))
}