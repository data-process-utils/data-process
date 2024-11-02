export type FileType = "JSON" | "CSV" | "XML" | "XLS"


export function getType(file: File) {
    const name = file.name
    const parts = name.split('.')
    const extension = parts[parts.length - 1]
    return extension.toUpperCase() as FileType
}