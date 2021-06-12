import React from 'react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useWeb3React } from '@web3-react/core'

import Button from '../../components/button/Button'

const injected = new InjectedConnector({
    supportedChainIds: [56, 97],
})

const ConnectButton = () => {
    const web3 = useWeb3React()

    const handleConnect = () => {
        web3.activate(injected)
    }

    return (
        <Button onClick={handleConnect}>Connect</Button>
    )
}

export default ConnectButton
