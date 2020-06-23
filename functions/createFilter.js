function createFilter(data) {
    let ft = {}

    data.forEach(dt => {
        switch (dt.operator.value) {
            case 'bw': {
                ft[dt.field.value] = {$gt: new Date(dt.value.value), $lt: new Date(dt.value.value2)};
            }
                break;
            case 'gt': {
                ft[dt.field.value] = {$gt: new Date(dt.value.value)}
            }
                break;
            case 'lt': {
                ft[dt.field.value] = {$lt: new Date(dt.value.value)}
            }
                break;
            case 'eq': {
                if (dt.operator.label == 'on')
                    ft[dt.field.value] = new Date(dt.value.value)
                else
                    ft[dt.field.value] = dt.value.value;
            }
                break;
            case 'ne': {
                ft[dt.field.value] = {$ne: dt.value.value}
            }
                break;
            default: {
                ft[dt.field.value] = dt.value.value;
            }
        }
    })
    //console.log(ft);
    return ft;
}

module.exports = createFilter;