import {Operator} from "@/types/filter-data";
import {isEqual, isGreaterThanOrEqual} from "@/lib/values";
import {containsArray, getValueInPath, getValuesInArray, isArray} from "@/lib/objects";

export type SearchParams = {
    field: string,
    operator: Operator,
    value: unknown,
}


export type DataFilterRequest= {
    params: SearchParams[],
    targetData: unknown | unknown[]
}

export interface SearchEngine<T> {
    search(params: SearchParams[], target: T | T[]):T | T[];

}


export abstract class AbstractSearchEngine<T> implements SearchEngine<T> {

    abstract search(params: SearchParams[], target: T | T[]):T | T[];


    protected isMatch(searchParams: SearchParams, target: T | T[]): boolean {
        const {field, operator, value} = searchParams;
        if (!field || !operator || !value) {
            return false;
        }

        if (isArray(target)) {
            if (containsArray(target as never, field)) {
                const values = getValuesInArray(target as never[], field)
                for (const item of values) {
                    if (this.isMatch(searchParams, item)) {
                        return true;
                    }
                }
            }
        } else {
            const targetValue = getValueInPath(target as never, field) as T;
            if (this.isMath(operator, targetValue, value)) {
                return true;
            }
        }

        return false;
    }


    protected isAllMatch(searchParams: SearchParams[], target: T | T[]): boolean {
        for (const item of searchParams) {
            if (!this.isMatch(item, target)) {
                return false;
            }
        }
        return true;
    }

    private isMath(operator: Operator, targetValue: T, value: unknown) {
        switch (operator) {
            case Operator.EQUAL:
                return isEqual(targetValue, value);
            case Operator.LESS_THEN:
                return isGreaterThanOrEqual(targetValue, value)
            case Operator.CONTAINS:
                return false;
            case Operator.STARTS_WITH:
                return String(targetValue).startsWith(String(value));
            case Operator.DIFFERENT:
                return !isEqual(targetValue, value);
            default:
                throw new Error(`Invalid operator: ${operator}`);
        }
    }


}