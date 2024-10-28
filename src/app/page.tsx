'use client';
// import {Button} from "@mantine/core";

import {useTranslator} from "@/hooks/use-translator";
import {generateFileSize, Unit} from "@/lib/unit";
import {Operator} from "@/types/filter-data";
import {messages, TranslationKeys} from "@/i18n/locales/tranlation";
import {z} from "zod";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useRef, useState} from "react";
import {SearchEngineFactory} from "@/lib/search-engine";
import {SearchParams} from "@/types/search-engine";
import {getKeys, getPropertyNames} from "@/lib/objects";
import {Panel} from "@/components/ui/panel";
import {Fieldset, Flex, HStack, Input, Progress, Select, Separator} from "@chakra-ui/react";
import {FileInput, FileUploadClearTrigger, FileUploadLabel, FileUploadRoot} from "@/components/ui/file-button";
import {ProgressBar, ProgressRoot, ProgressValueText} from "@/components/ui/progress";
import {Field} from "@/components/ui/field";
import {Button} from "@/components/ui/button";
import {InputGroup} from "@/components/ui/input-group";
import {LuFileUp} from "react-icons/lu";
import {CloseButton} from "@/components/ui/close-button";
// import Head from "next/head";


const fileUnit: Unit = 'MB'
// 800MB
const maxFileSize = generateFileSize(800, fileUnit)

const operatorKeys = Object.keys(Operator) as Array<Operator>;

const OperatorSchema = z.enum(operatorKeys as [Operator, ...Operator[]], {
    errorMap: () => ({message: messages.operator_required_message})
});


const formSchema = z.object({
    jsonFile: z
        .custom<File | null>((value) => {
            if (!value) {
                return false;
            }
            return value instanceof File;
        }, {message: messages.json_file_required})
        .refine((file) => file != undefined && file.size <= maxFileSize, {
            message: messages.json_file_size_max_message,
        }),


    items: z.array(z.object({
        fieldPath: z.string().min(1, messages.field_required_message),
        operator: OperatorSchema,
        value: z.string().min(1, messages.value_required_message),
        negate: z.boolean().default(false)
    }))
});


type OperatorTranslator = {
    operator: Operator,
    labelKey: TranslationKeys | string
}

const operatorTranslator: OperatorTranslator[] = [
    {labelKey: 'equal_label', operator: Operator.EQUAL},
    {labelKey: 'less_than_label', operator: Operator.LESS_THEN},
    {labelKey: 'different_label', operator: Operator.DIFFERENT},
    {labelKey: "greater_than_label", operator: Operator.GREATER_THAN},
    {labelKey: "contains_label", operator: Operator.CONTAINS},
    {labelKey: "starts_with_label", operator: Operator.STARTS_WITH},
    {labelKey: "ends_with_label", operator: Operator.ENDS_WITH},
    {labelKey: "less_than_or_equal_label", operator: Operator.LESS_THAN_OR_EQUAL},
    {labelKey: "greater_than_or_equal_label", operator: Operator.GREATER_THAN_OR_EQUAL},

]

type FormData = z.infer<typeof formSchema>;


export default function Home() {
    const {translate} = useTranslator()

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            items: [
                {
                    fieldPath: "",
                    operator: Operator.EQUAL,
                    value: "",
                    negate: false,
                }
            ],
        },
    });

    const {control, handleSubmit, watch, formState: {errors, isSubmitting}} = form;
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const fileInputRef = useRef<HTMLButtonElement>(null);
    const firstErrorRef = useRef<HTMLDivElement | null>(null);
    const {fields, append, remove} = useFieldArray({
        control,
        name: "items", // Nome do campo do array
    });

    const [fileData, setFileData] = useState<unknown>()

    const items = watch("items");

    const fileUploaded = watch('jsonFile')

    const onSubmit = async (data: FormData) => {

        const result = await SearchEngineFactory.createSearchEngine('JSON').search(createParams(data), fileData)

        const fileResult: string
            = JSON.stringify(result, null, 4)

        const blob = new Blob([fileResult], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'result.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    function createParams(param: FormData) {
        return param.items.map(item => {
            return {
                field: item.fieldPath,
                operator: item.operator,
                value: item.value,
            } as SearchParams
        })
    }

    const handleFileChange = (file: File | null) => {
        if (file) {
            console.log(file.size);
            console.log(maxFileSize);

            if (file.size > maxFileSize) return;

            form.setValue("jsonFile", file);

            const chunkSize = 1024 * 1024; // 1 MB
            let offset = 0;
            const reader = new FileReader();
            let jsonTextBuffer = ""; // Buffer para acumular o JSON

            const updateProgress = (loadedBytes: number, totalBytes: number) => {
                const percentComplete = Math.min((loadedBytes / totalBytes) * 100, 100);
                setUploadProgress(percentComplete);
            };

            reader.onload = (event) => {
                const textChunk = event.target?.result as string;
                if (textChunk) {
                    jsonTextBuffer += textChunk; // Adiciona o chunk ao buffer
                }

                offset += chunkSize;
                updateProgress(offset, file.size);

                if (offset < file.size) {
                    readNextChunk();
                } else {
                    finalizeProcessing();
                }
            };

            const readNextChunk = () => {
                const chunk = file.slice(offset, offset + chunkSize);
                reader.readAsText(chunk);
            };

            const finalizeProcessing = () => {
                try {
                    console.log(jsonTextBuffer);
                    const parsedData = JSON.parse(jsonTextBuffer); // Faz o parse após juntar o JSON completo
                    setFileData(parsedData);
                    console.log(parsedData);
                } catch (error) {
                    console.error("Erro ao fazer o parse do JSON:", error);
                } finally {
                    setTimeout(() => setUploadProgress(0), 1000);
                }
            };

            readNextChunk(); // Inicia a leitura do primeiro chunk
        }
    };


    const getStyleItem = (index: number) => {
        return !(errors?.items?.[index]) ? 'self-end' : 'self-center h-[80px]';
    };


    useEffect(() => {
        const errors = Object.keys(control.getFieldState("items")).length > 0;

        if (errors && firstErrorRef.current) {
            firstErrorRef.current.scrollIntoView({behavior: "smooth", block: "center"});
        }
    }, [control]);

    function createItem() {
        append({fieldPath: "", operator: Operator.EQUAL, value: "", negate: false});
    }

    return (
        <div className="mt-10">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                <Panel title={translate('details_title')} className="mb-5">
                    <Flex direction="column" flex="1" gap={6} w="100%">
                        <Flex w="100%" direction="column" gap="5">
                            <Controller render={({field}) =>
                                <FileUploadRoot accept={["application/json"]} gap="1" w="full" onFileChange={e => {
                                    field.onChange(e)
                                    handleFileChange(e.acceptedFiles[0])
                                }}>
                                    <FileUploadLabel>{translate('json_file_label')}</FileUploadLabel>
                                    <InputGroup w="full" startElement={<LuFileUp/>} endElement={
                                        <FileUploadClearTrigger asChild>
                                            <CloseButton
                                                me="-1"
                                                size="xs"
                                                variant="plain"
                                                focusVisibleRing="inside"
                                                focusRingWidth="2px"
                                                pointerEvents="auto"
                                                color="fg.subtle"
                                            />
                                        </FileUploadClearTrigger>
                                    }>
                                        <FileInput placeholder={translate('select_file_label')}/>
                                    </InputGroup>
                                </FileUploadRoot>
                            } name="jsonFile" control={control}/>
                            {uploadProgress > 0 && (
                                <ProgressRoot value={uploadProgress} w="full" striped animated>
                                    <HStack gap="5">
                                        <ProgressBar flex="1"/>
                                        <ProgressValueText>{`${uploadProgress.toFixed(2)}%`}</ProgressValueText>
                                    </HStack>

                                </ProgressRoot>
                                // <ProgressBar w="100%" value={uploadProgress} radius="xl" animated/>
                            )}
                        </Flex>


                        <Separator/>
                        <Button
                            // radius="xl"
                            variant="outline"
                            color="red"
                            type="button"
                            onClick={() => createItem()}
                            className="mt-4 self-end"
                        >
                            {translate('add_item_label')}
                        </Button>
                    </Flex>

                </Panel>
                <Button
                    // loading={isSubmitting}
                    // loaderProps={{type: 'dots'}}
                    // radius="xl"
                    colorPalette="purple" variant="solid"
                    size="md"
                    className="my-5 self-end"
                    // variant="filled"
                    type="submit">{translate('process_label')}</Button>

            </form>
        </div>
    );
}
