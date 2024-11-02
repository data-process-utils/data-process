import {Operator} from "@/types/filter-data";
import {TranslationKeys} from "@/i18n/tranlation";

export type OperatorTranslator = {
    operator: Operator,
    labelKey: TranslationKeys | string
}

export const operatorTranslator: OperatorTranslator[] = [
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