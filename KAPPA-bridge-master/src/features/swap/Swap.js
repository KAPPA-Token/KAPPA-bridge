import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

import Energy8TokenABI from '../../abi/KAPPA.abi.json'
import Energy8RouterABI from '../../abi/KAPPA.abi.json'
import { Energy8TokenAddress, Energy8RouterAddress } from '../../constants'

// Utils
import safeCall from '../../utils/safeCall'
import useContract from '../../utils/useContract'
import sendWithWait from '../../utils/sendWithWait'

// Components
import Input from '../../components/input/Input'
import Hidden from '../../components/hidden/Hidden'
import Visible from '../../components/visible/Visible'
import ConnectButton from '../../components/connect-button/ConnectButton'
import Button from '../../components/button/Button'
import { SwapWrapper, SwapHeader, SwapContent } from './styled'

const serverCurrencyRate = 1000

const Swap = () => {
    const [KAPPABalance, setKAPPABalance] = useState(BigNumber.from(0))
    const [values, setValues] = useState({
        KAPPA: '',
        ServerValue: '',
        nickname: '',
        serverId: 0, // hardcoded server id
    })
    const [isApproved, setApproved] = useState(false)
    const [isLoading, setLoading] = useState(false)

    const web3 = useWeb3React()

    const SlimeToken = useContract(KAPPATokenAddress, KAPPATokenABI)
    const SlimeRouter = useContract(KAPPARouterAddress, KAPPARouterABI)

    const handleSLTChange = safeCall(({ value }) => {
        if (!value) {
            resetValues()
        } else {
            const newSLTValue = BigNumber.from(value)

            setValues({
                ...values,
                KAPPA: newKAPPAValue,
                ServerValue: newKAPPAValue.div(serverCurrencyRate),
            })
        }
    })

    const handleServerValueChange = safeCall(({ value }) => {
        if (!value) {
            resetValues()
        } else {
            const newServerValue = BigNumber.from(value)

            setValues({
                ...values,
                KAPPA: newServerValue.mul(serverCurrencyRate),
                ServerValue: newServerValue,
            })
        }
    })

    const resetValues = () => {
        setValues({
            ...values,
            KAPPA: '',
            ServerValue: '',
        })
    }

    const handleDeposit = () => {
        if (!values.ServerValue || values.ServerValue.lte(0)) {
            return toast.error('Значение должно быть больше 0')
        }

        if (!values.KAPPA || values.KAPPA.gt(KAPPABalance.div(10**9))) {
            return toast.error('Недостаточно Е8 на балансе')
        }

        if (!values.nickname) {
            return toast.error('Поле nickname не может быть пустым')
        }

        if (values.ServerValue.gt(0) && values.KAPPA.lte(KAPPABalance.div(10**9))) {
            sendWithWait(
                KAPPARouter.deposit(values.serverId, values.nickname, values.KAPPA.mul(10**9).toString())
                    .then(() => setLoading(true))
            )
                .then(() => setLoading(false))
                .catch(err => toast.error(err.data.message.replace('execution reverted: ', '')))
        }
    }

    const handleApprove = () => {
        sendWithWait(
            KAPPA.approve(KAPPARouterAddress, MaxUint256)
                .then(() => setLoading(true))
        )
            .then(() => {
                setApproved(true)
                setLoading(false)
            })
            .catch(err => toast.error(err.data.message.replace('execution reverted: ', '')))
    }

    const handleChange = ({ id, value }) => {
        setValues({
            ...values,
            [id]: value,
        })
    }

    useEffect(() => {
        if (KAPPA) {
            KAPPA.callStatic.balanceOf(web3.account).then(balance => {
                setKAPPABalance(BigNumber.from(balance))
            })

            KAPPA.callStatic.allowance(web3.account, KAPPARouterAddress).then(allowance => {
                setApproved(allowance.toString() !== '0')
            })
        }
    }, [KAPPA])

    return (
        <SwapWrapper>
            <SwapContent>
                Content
            </SwapContent>
            <Hidden isHidden={web3.active}>
                <ConnectButton />
            </Hidden>
            <Visible isVisible={web3.active && isApproved}>
                <Button disabled={isLoading} onClick={handleDeposit}>Deposit</Button>
            </Visible>
            <Hidden isHidden={isApproved || !web3.active}>
                <Button disabled={isLoading} onClick={handleApprove}>Approve</Button>
            </Hidden>
        </SwapWrapper>
    )
}

export default Swap
