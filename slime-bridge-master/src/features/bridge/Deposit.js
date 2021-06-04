import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

import SlimeTokenABI from '../../abi/SlimeToken.abi.json'
import SlimeRouterABI from '../../abi/SlimeRouter.abi.json'
import { SlimeTokenAddress, SlimeRouterAddress } from '../../constants'

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

const Deposit = () => {
    const [E8Balance, setE8Balance] = useState(BigNumber.from(0))
    const [values, setValues] = useState({
        E8: '',
        ServerValue: '',
        nickname: '',
        serverId: 0, // hardcoded server id
    })
    const [isApproved, setApproved] = useState(false)
    const [isLoading, setLoading] = useState(false)

    const web3 = useWeb3React()

    const SlimeToken = useContract(SlimeTokenAddress, SlimeTokenABI)
    const SlimeRouter = useContract(SlimeRouterAddress, SlimeRouterABI)

    const handleE8Change = safeCall(({ value }) => {
        if (!value) {
            resetValues()
        } else {
            const newE8Value = BigNumber.from(value)

            setValues({
                ...values,
                E8: newE8Value,
                ServerValue: newE8Value.div(serverCurrencyRate),
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
                E8: newServerValue.mul(serverCurrencyRate),
                ServerValue: newServerValue,
            })
        }
    })

    const resetValues = () => {
        setValues({
            ...values,
            SLT: '',
            ServerValue: '',
        })
    }

    const handleDeposit = () => {
        if (!values.ServerValue || values.ServerValue.lte(0)) {
            return toast.error('Значение должно быть больше 0')
        }

        if (!values.SLT || values.SLT.gt(SLTBalance.div(10**9))) {
            return toast.error('Недостаточно Е8 на балансе')
        }

        if (!values.nickname) {
            return toast.error('Поле nickname не может быть пустым')
        }

        if (values.ServerValue.gt(0) && values.SLT.lte(SLTBalance.div(10**9))) {
            sendWithWait(
                SlimeRouter.deposit(values.serverId, values.nickname, values.SLT.mul(10**9).toString())
                    .then(() => setLoading(true))
            )
                .then(() => setLoading(false))
                .catch(err => toast.error(err.data.message.replace('execution reverted: ', '')))
        }
    }

    const handleApprove = () => {
        sendWithWait(
            SlimeToken.approve(SlimeRouterAddress, MaxUint256)
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
        if (SlimeToken) {
            SlimeToken.callStatic.balanceOf(web3.account).then(balance => {
                setSLTBalance(BigNumber.from(balance))
            })

            SlimeToken.callStatic.allowance(web3.account, SlimeRouterAddress).then(allowance => {
                setApproved(allowance.toString() !== '0')
            })
        }
    }, [SlimeToken])

    return (
        <SwapWrapper>
            <SwapHeader>
                <Link to="/deposit" className='active'>Deposit</Link>
                <Link to="/withdraw">Withdraw</Link>
            </SwapHeader>
            <SwapContent>
                <Input
                    id="nickname"
                    label="Your server nickname"
                    value={values.nickname}
                    placeholder=""
                    onChange={handleChange}
                />
                <Input
                    id="SLT-amount"
                    label={`SLT (${SLTBalance.div(10**9).toString()})`}
                    value={values.SLT.toString()}
                    onChange={handleE8Change}
                />
                <Input
                    id="server-amount"
                    label="Ocean of Anarchy"
                    value={values.ServerValue.toString()}
                    onChange={handleServerValueChange}
                />
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

export default Deposit
