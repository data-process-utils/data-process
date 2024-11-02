'use client';
import {ChangeEvent, InputHTMLAttributes, useRef, useState} from "react";
import {Upload} from "react-feather";
import {Flex, Input} from "@chakra-ui/react";
import {CloseButton} from "@/components/ui/close-button";

type InputFileProps = {
    onFileChange?: (file: File | null) => void
} & InputHTMLAttributes<HTMLInputElement>

function InputFile({onFileChange, accept}: InputFileProps) {

    const ref = useRef<HTMLInputElement>(null);


    const [selectedFile, setSelectedFile] = useState<File>();

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            console.log(e.target.files)
            if (ref && typeof ref !== 'function' && ref.current) {
                ref.current.value = e.target.files[0]?.name
            }
            setSelectedFile(e.target.files[0])
            if (onFileChange) {
                onFileChange(e.target.files[0])
            }
        } else {
            setSelectedFile(null as unknown as File)
            if (ref && typeof ref !== 'function' && ref.current) {
                ref.current.value = ''
            }
            if (onFileChange) {
                onFileChange(null as unknown as File)
            }
        }
    }

    const handleClear = () => {
        if (ref && typeof ref !== 'function' && ref.current) {
            ref.current.value = '';
            setSelectedFile(null as unknown as File)
        }
        if (onFileChange) {
            onFileChange(null as unknown as File)
        }
    };


    return <div className={`flex flex-row items-center gap-2`}>
        <input type="file" id="custom-input" hidden onChange={onChange} accept={accept}/>
        <label

            htmlFor="custom-input"
            className="block  w-[200px] mr-4 py-2 px-4
            rounded-md border-0 text-sm font-semibold bg-purple-50
            text-purple-700 hover:bg-purple-100 cursor-pointer"
        >
            <Flex flex={5} align="center" justify={"center"} gap={5}> <Upload/> Choose file</Flex>
        </label>
        <Input ref={ref} disabled/>
        <CloseButton onClick={handleClear} disabled={!selectedFile}/>
    </div>
}


// InputFile.displayName = 'InputFile'

export {InputFile}

export default InputFile