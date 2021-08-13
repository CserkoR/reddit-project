
export default function timestampHandler(timestamp) {
    const realDate = new Date(timestamp * 1000);
    let todate = realDate.getDate();
    let tomonth = realDate.getMonth() + 1;
    const toyear = realDate.getFullYear();
    if (tomonth < 10) {
        tomonth = "0" + tomonth;
    }
    if (todate < 10) {
        todate = "0" + todate;
    }
    const original_date = toyear + '.' + tomonth + '.' + todate + ".";
    return original_date;
}