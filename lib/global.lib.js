function setGlobalKey(key, value) {
    try {
        global[key] = value
    } catch (error) {
        throw error
    }
}


function getGlobalKey(key) {
    try {
        return global[key]
    } catch (error) {
        throw error
    }
}

function getOrSetGlobalKey(key, value) {
    try {
        if (global[key]) {
            return global[key]
        } else {
            global[key] = value
            return global[key]
        }
    } catch (error) {
        throw error
    }
}

module.exports = {
    setGlobalKey: setGlobalKey,
    getGlobalKey: getGlobalKey,
    getOrSetGlobalKey: getOrSetGlobalKey
}
