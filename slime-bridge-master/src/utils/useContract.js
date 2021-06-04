import { useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'

import getSigner from './getSigner'

const useContract = (address, abi) => {
    const web3 = useWeb3React()

    return useMemo(() => {
        if (!web3.library) {
            return null
        }

        const signer = getSigner(web3)

        return new Contract(address, abi, signer)
    }, [web3.account])
}

export default useContract
