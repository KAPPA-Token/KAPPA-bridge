const safeCall = (func) => (...args) => {
    try {
        func(...args)
    } catch {}
}

export default safeCall
