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
    if (typeof dateStr !== 'string') throw new Error('Parameter is not of type string')
    let [day, month, year] = dateStr.split(' ');
    if (!day || !month || !year) throw new Error('Parameter does not match the required date format')

    month = months[month];
    return new Date(`${month} ${day}, ${year}`);

}
