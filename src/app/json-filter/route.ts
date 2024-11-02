import {DataFilterRequest} from "@/lib/search-engine/search-engine";


export async function POST(request: Request) {
    const {fileContent} = await request.json() as DataFilterRequest

    console.log(fileContent)


    // const filteredData = await filterData(data)
    // await new Promise(r => setTimeout(r, 2000));
    // const encoder = new TextEncoder()
    // return new Response(encoder.encode(JSON.stringify(filteredData)))
}