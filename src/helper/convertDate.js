/**
 * Converts and uniformize date
 * @param dateStr
 * @return {Date}
 */
export const convertDate = (dateStr) => {

    const months = {
        'Janv.': 'Jan',
        'Févr.': 'Feb',
        'Mars': 'Mar',
        'Avr.': 'Apr',
        'Mai': 'May',
        'Jui.': 'Jun',
        'Juil.': 'Jul',
        'Aoû.': 'Aug',
        'Sept.': 'Sep',
        'Oct.': 'Oct',
        'Nov.': 'Nov',
        'Déc.': 'Dec'
    }
    if (typeof dateStr !== 'string') throw new Error(`helper/convertDate function : Parameter is not of type string ${dateStr}`)

    /**
     * For the test, the date is in format {YYYY-MM-DD} while in the app it is {DD MM YYYY}, so we check if the separator is "-" or " "
     * @type {string[]}
     */
    let splitDate = dateStr.includes("-") ? dateStr.split('-') : dateStr.split(" ")
    // console.log(splitDate) // debug

    let day, month, year;
    /**
     * For the test, the date is in format {YYYY-MM-DD} while in the app it is {DD MM YYYY}, so we check the first element's length
     */
    splitDate[0].length > 2 ? [year, month, day] = splitDate : [day, month, year] = splitDate;
    // console.table({day, month, year}) // debug

    if (!day || !month || !year)
        throw new Error('helper/convertDate function : Parameter does not match the required date format')

    /**
     * For English format
     */
    if (!months[month])
        return new Date(`${month} ${day}, ${year}`);

    /**
     * French Format will be converted
     */
    const convertedMonth = months[month];

    return new Date(`${convertedMonth} ${day}, ${year}`);

}
