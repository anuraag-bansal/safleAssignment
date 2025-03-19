function isEmpty(value) {
    return (
        value === undefined ||
        value === "undefined" ||
        value === "null" ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" &&
            !(value instanceof Set) &&
            Object.keys(value).length === 0) ||
        (value instanceof Set && value.size === 0)
    )
}


function isNil(value) {
    return value === null || value === undefined
}

module.exports = {
    isEmpty: isEmpty,
    isNil: isNil,
}
