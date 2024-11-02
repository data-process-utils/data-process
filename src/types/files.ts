export type FileType = "JSON" | "CSV" | "XML" | "XLS"


export function getType(file: File) {
    const name = file.name
    const parts = name.split('.')
    const extension = parts[parts.length - 1]
    return extension.toUpperCase() as FileType
}

export function read(file: File, readingMode: "text" | "arrayBuffer" = "text") {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.onerror = () => {
            reject(reader.error)
        }
        if (readingMode === "arrayBuffer") {
            reader.readAsArrayBuffer(file)
        } else {
            reader.readAsText(file)
        }
    })
}