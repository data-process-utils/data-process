import {DataFilterRequest} from "@/lib/search-engine/search-engine";

export const config = {
    api: {
        bodyParser: false, // Desativa o bodyParser padrão para permitir uploads de arquivos
    },
};

export async function POST(request: Request) {
    const {fileContent} = await request.json() as DataFilterRequest

    const data = await request.formData();


    console.log(`filecontent ${fileContent}`)

    const buffer = Buffer.from(fileContent);

    const decodedContent = buffer.toString('utf-8')

    console.log(`decodedContent ${decodedContent}`)


    // const filteredData = await filterData(data)
    // await new Promise(r => setTimeout(r, 2000));
    const encoder = new TextEncoder()
    return new Response(encoder.encode(JSON.stringify({teste: '123'})))
}