import {z} from "zod";
import {messages} from "@/i18n/tranlation";
import {generateFileSize, Unit} from "@/lib/unit";
import {Operator} from "@/types/filter-data";


const fileUnit: Unit = 'MB'
// 800MB
const maxFileSize = generateFileSize(800, fileUnit)

const operatorKeys = Object.keys(Operator) as Array<Operator>;

const OperatorSchema = z.enum(operatorKeys as [Operator, ...Operator[]], {
    errorMap: () => ({message: messages.operator_required_message})
});


export const schema = z.object({
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

export type FilterDataFormData = z.infer<typeof schema>;


