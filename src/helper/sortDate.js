import {convertDate} from "./convertDate.js";

export const sortDate = (data) => {
    // console.log("DEBUGG", data)
    let sorted = data.sort((a, b) => convertDate(b?.date || b) - convertDate(a?.date || a));
    if (!sorted)
        throw new Error(`helper/sortDate - error during sorting`)
    return sorted
}
