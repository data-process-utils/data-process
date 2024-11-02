'use client';
// import {Button} from "@mantine/core";

import {useTranslator} from "@/hooks/use-translator";
import {generateFileSize, Unit} from "@/lib/unit";
import {Operator} from "@/types/filter-data";
import {messages, TranslationKeys} from "@/i18n/tranlation";
import {z} from "zod";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useRef, useState} from "react";
import {DataFilterRequest, SearchParams} from "@/types/search-engine";
import {getPropertyNames} from "@/lib/objects";
import {Panel} from "@/components/ui/panel";
import {createListCollection, Fieldset, Flex, HStack, Input, Separator, Stack} from "@chakra-ui/react";
import {FileInput, FileUploadClearTrigger, FileUploadLabel, FileUploadRoot} from "@/components/ui/file-button";
import {ProgressBar, ProgressRoot, ProgressValueText} from "@/components/ui/progress";
import {Button} from "@/components/ui/button";
import {InputGroup} from "@/components/ui/input-group";
import {LuFileUp} from "react-icons/lu";
import {CloseButton} from "@/components/ui/close-button";
import {SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText} from "@/components/ui/select";
import {Field} from "@/components/ui/field";
import {Checkbox} from "@/components/ui/checkbox";
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
    const firstErrorRef = useRef<HTMLDivElement | null>(null);
    const {fields, append, remove} = useFieldArray({
        control,
        name: "items", // Nome do campo do array
    });

    const [fileData, setFileData] = useState<unknown>()

    const items = watch("items");

    const fileUploaded = watch('jsonFile')

    const onSubmit = async (data: FormData) => {
        console.log(data)
        const requestData: DataFilterRequest = {
            targetData: fileData,
            params: createParams(data),
        }

        const result = await fetch('/json-filter', {
            method: 'POST',
            body: JSON.stringify(requestData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async r => {

            const response = r.body

            if (response) {
                console.log(response)
                const decoder = new TextDecoder()
                const result = decoder.decode(await readStreamData(response))
                console.log(result)
                return JSON.parse(result)
            }
            return null
        })
        if (data) {

            console.log(result)


            const fileResult: string
                = JSON.stringify(result, null, 4)

            const blob = new Blob([fileResult], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `result-.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };


    async function readStreamData(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
        const reader = stream.getReader();
        const chunks: Uint8Array[] = [];

        try {
            while (true) {
                const {done, value} = await reader.read();
                if (done) break;

                if (value) {
                    chunks.push(value);
                }
            }
        } finally {
            reader.releaseLock();
        }

        // Concatenate all Uint8Array chunks into a single Uint8Array
        const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }

        return result;
    }


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
            // console.log(file.size);
            // console.log(maxFileSize);

            if (file.size > maxFileSize) return;

            form.setValue("jsonFile", file);

            // const chunkSize = 1024 * 1024; // 1 MB
            // let offset = 0;
            // const reader = new FileReader();
            // let jsonTextBuffer = ""; // Buffer para acumular o JSON

            // const updateProgress = (loadedBytes: number, totalBytes: number) => {
            //     const percentComplete = Math.min((loadedBytes / totalBytes) * 100, 100);
            //     setUploadProgress(percentComplete);
            // };

            // reader.onload = (event) => {
            //     const textChunk = event.target?.result as string;
            //     if (textChunk) {
            //         jsonTextBuffer += textChunk; // Adiciona o chunk ao buffer
            //     }
            //
            //     offset += chunkSize;
            //     updateProgress(offset, file.size);
            //
            //     if (offset < file.size) {
            //         readNextChunk();
            //     } else {
            //         finalizeProcessing();
            //     }
            // };

            // const readNextChunk = () => {
            //     const chunk = file.slice(offset, offset + chunkSize);
            //     reader.readAsText(chunk);
            // };

            // const finalizeProcessing = () => {
            //     try {
            //         console.log(jsonTextBuffer);
            //         const parsedData = JSON.parse(jsonTextBuffer); // Faz o parse após juntar o JSON completo
            //         setFileData(parsedData);
            //         console.log(parsedData);
            //     } catch (error) {
            //         console.error("Erro ao fazer o parse do JSON:", error);
            //     } finally {
            //         setTimeout(() => setUploadProgress(0), 1000);
            //     }
            // };

            // readNextChunk(); // Inicia a leitura do primeiro chunk
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


    const createItems = () => {
        const items = getPropertyNames(fileData).map(data => {
            return {
                label: data.propertyName == data.property ? data.property : `${data.property} (${data.propertyName})`,
                value: data.property
            }
        })

        return createListCollection({
            items: items
        })
    }

    const createOperators = () => {
        const items = operatorTranslator.map(op => {
            return {
                label: translate(op.labelKey),
                value: op.operator
            }
        })

        return createListCollection({
            items: items
        })
    }

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
                            )}
                        </Flex>


                        <Separator/>
                        <Fieldset.Root size="lg" w={"full"}>
                            <Stack className="px-8">
                                <Fieldset.Legend>{translate('fields_to_filter_label')}</Fieldset.Legend>
                            </Stack>
                            <Fieldset.Content>
                                <Flex direction="column" className="gap-5 px-6" w={"full"}>
                                    {fields.map((_, i) => (
                                        <Flex flex={1} gap={20} w="100%" key={i} ref={i === 0 ? firstErrorRef : null}
                                              align="end">
                                            <Controller
                                                render={({field}) => (
                                                    !(fileUploaded && fileData) ?
                                                        <Field required
                                                               w={"full"}
                                                               invalid={!!errors.items?.[i]?.fieldPath?.message}
                                                               errorText={errors.items?.[i]?.fieldPath?.message && translate(errors.items?.[i]?.fieldPath?.message)}
                                                               label={translate('operator_label')}
                                                               className={`${getStyleItem(i)}`}
                                                        >
                                                            <Input  {...field}/>
                                                        </Field>
                                                        :
                                                        <Field required
                                                               invalid={!!errors.items?.[i]?.fieldPath?.message}
                                                               errorText={errors.items?.[i]?.fieldPath?.message && translate(errors.items?.[i]?.fieldPath?.message)}
                                                               label={translate('operator_label')}
                                                               w={"full"}
                                                               className={`${getStyleItem(i)}`}
                                                        >
                                                            <SelectRoot
                                                                name={field.name}
                                                                value={[field.value]}
                                                                onValueChange={({value}) => {
                                                                    console.log(value[0])
                                                                    if (value[0]) {
                                                                        field.onChange(value[0])
                                                                    } else {
                                                                        field.onChange('')
                                                                    }


                                                                }}
                                                                onInteractOutside={() => field.onBlur()}
                                                                collection={createItems()}>
                                                                <SelectTrigger>
                                                                    <SelectValueText/>
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {createItems().items.map(value => (
                                                                        <SelectItem key={value.value}
                                                                                    item={value.value}>
                                                                            {value.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </SelectRoot>
                                                        </Field>
                                                )}
                                                control={control} name={`items.${i}.fieldPath`}/>

                                            <Controller
                                                render={({field}) => (
                                                    <Field required
                                                           invalid={!!errors.items?.[i]?.operator?.message}
                                                           errorText={errors.items?.[i]?.operator?.message && translate(errors.items?.[i]?.operator?.message)}
                                                           label={translate('operator_label')}
                                                           w={"full"}
                                                           className={`${getStyleItem(i)}`}>
                                                        <SelectRoot
                                                            name={field.name}
                                                            value={[field.value]}
                                                            onValueChange={({value}) => {
                                                                field.onChange(value[0])
                                                            }}
                                                            onInteractOutside={() => field.onBlur()}
                                                            collection={createOperators()}>
                                                            <SelectTrigger>
                                                                <SelectValueText/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {createOperators().items.map(value => (
                                                                    <SelectItem key={value.value}
                                                                                item={value.value}>
                                                                        {value.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </SelectRoot>
                                                    </Field>)
                                                } name={`items.${i}.operator`} control={control}/>

                                            <Controller render={
                                                ({field}) => (
                                                    <Field
                                                        w={"30px"}
                                                        invalid={!!errors.items?.[i]?.negate?.message}
                                                        errorText={errors.items?.[i]?.negate?.message && translate(errors.items?.[i]?.negate?.message)}
                                                        label={translate('negate_label')}
                                                        className={`${getStyleItem(i)} h-full`}>
                                                        <Checkbox checked={field.value}
                                                                  colorPalette={"purple"}
                                                                  onCheckedChange={e => field.onChange(e.checked)}/>
                                                    </Field>
                                                )}
                                                        control={control} name={`items.${i}.negate`}/>
                                            <Controller render={({field}) => (
                                                <Field required label={translate('value_label')}
                                                       w={"full"}
                                                       className={`${getStyleItem(i)}`}
                                                       invalid={!!errors.items?.[i]?.value?.message}
                                                       errorText={errors.items?.[i]?.value?.message && translate(errors.items?.[i]?.value?.message)}>
                                                    <Input   {...field} />
                                                </Field>
                                            )} control={control} name={`items.${i}.value`}/>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                colorPalette={"purple"}
                                                onClick={() => remove(i)}
                                                className={`"mt-2" ${getStyleItem(i)}`}
                                                disabled={items.length <= 1}
                                            >
                                                {translate('remove_label')}
                                            </Button>
                                        </Flex>
                                    ))}
                                </Flex>

                            </Fieldset.Content>
                        </Fieldset.Root>
                        <Button
                            variant="outline"
                            color="purple"
                            type="button"
                            onClick={() => createItem()}
                            className="mt-4 self-end"
                        >
                            {translate('add_item_label')}
                        </Button>
                    </Flex>

                </Panel>
                <Button
                    loading={isSubmitting}
                    colorPalette="purple" variant="solid"
                    size="md"
                    className="my-5 self-end"
                    type="submit">{translate('process_label')}</Button>

            </form>
        </div>
    );
}
