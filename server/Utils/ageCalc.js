const ageCalc = (date) => {
    let parseDate = Date.parse(date);
    let bthDate = new Date(parseDate)
    console.log(bthDate)
    let monthDiff = Date.now() - bthDate.getTime()

    let ageDate = new Date(monthDiff)
    let year = ageDate.getUTCFullYear();
    let age = Math.abs(year - 1970)
    console.log(age)
    return age
}

module.exports = ageCalc;
