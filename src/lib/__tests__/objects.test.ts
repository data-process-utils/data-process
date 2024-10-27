import {test, expect} from "vitest";
import {getValuesInArray} from "@/lib/objects.ts";


const logValues =  process.env.NODE_ENV !== "production"

type AditionalData = {
    name: string
    description: string,
    detail?: {
        name: string,
    }
}

type FakeAddress = {
    city: string
    adtionaldata: AditionalData[]
}



type FakeTye = {
    name: string,
    addreses: FakeAddress[],
    aditionaldata?: AditionalData
}

const fakeObj: FakeTye[] = [
    {
        name: "John Doe",
        aditionaldata: {
            name: "Personal",
            description: "123 Main St",
            detail:{
                name: "Personal description"
            }
        },
        addreses: [
            {
                city: "New York",
                adtionaldata: [
                    {
                        name: "Home",
                        description: "123 Main St",
                        detail: {
                            name: "Personal description"
                        }
                    },
                    {
                        name: "Work",
                        description: "456 Elm St",
                        detail: {
                            name: "Work description"
                        }
                    }
                ]
            }
        ]
    }
]


test("test find values in array (simple value)", () => {
    const expectedValues = ['John Doe']
    const result = getValuesInArray(fakeObj as never[],'name')
    if(logValues) {
        console.log(JSON.stringify(fakeObj, null, 4))
        console.log(result)
    }
    expect(result).toEqual(expectedValues)
})


test("test find values in array (nexted value 2 levels)", () => {
    const expectedValues = ['Personal']
    const result = getValuesInArray(fakeObj as never[],'aditionaldata.name')
    if(logValues) {
        console.log(JSON.stringify(fakeObj, null, 4))
        console.log(result)
    }
    expect(result).toEqual(expectedValues)
})


test("test find values in array (nexted value 3 levels)", () => {
    const expectedValues = ['Personal description']
    const result = getValuesInArray(fakeObj as never[],'aditionaldata.detail.name')
    if(logValues) {
        console.log(JSON.stringify(fakeObj, null, 4))
        console.log(result)
    }
    expect(result).toEqual(expectedValues)
})


test("test find values in array (nexted value array simple value)", () => {
    const expectedValues = ['New York']
    const result = getValuesInArray(fakeObj as never[],'addreses.city')
    if(logValues) {
        console.log(JSON.stringify(fakeObj, null, 4))
        console.log(result)
    }
    expect(result).toEqual(expectedValues)
})

test("test find values in array (nexted value array nexted value)", () => {
    const expectedValues = ['Home', 'Work']
    const result = getValuesInArray(fakeObj as never[],'addreses.adtionaldata.name')
    if(logValues) {
        console.log(JSON.stringify(fakeObj, null, 4))
        console.log(result)
    }
    expect(result).toEqual(expectedValues)
})

test("test find values in array (nexted value array 3 levels)", () => {
    const expectedValues = ['Personal description', 'Work description']
    const result = getValuesInArray(fakeObj as never[],'addreses.adtionaldata.detail.name')
    if(logValues) {
        console.log(JSON.stringify(fakeObj, null, 4))
        console.log(result)
    }
    expect(result).toEqual(expectedValues)
})