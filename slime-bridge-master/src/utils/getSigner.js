const getSigner = (web3) => {
    return web3.library.getSigner(web3.account).connectUnchecked()
}

export default getSigner
