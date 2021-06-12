import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from '@ethersproject/bignumber'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

import Input from '../../components/input/Input'
import Button from '../../components/button/Button'
import Hidden from '../../components/hidden/Hidden'
import ConnectButton from '../../components/connect-button/ConnectButton'
import { SwapWrapper, SwapHeader, SwapContent } from './styled'

import ServerApi from '../../utils/api'

const serverCurrencyRate = 1000

const Withdraw = () => {
    const [serverBalance, setServerBalance] = useState(BigNumber.from(0))
    const [values, setValues] = useState({
        KAPPA: '',
        ServerValue: '',
        nickname: '',
        serverId: 0, // hardcoded server id
    })

    const web3 = useWeb3React()

    const handleKAPPAChange = ({ value }) => {
        try {
            if (!value) {
                resetValues()
            } else {
                const newSLTValue = BigNumber.from(value)

                setValues({
                    ...values,
                    KAPPA: newKAPPAValue,
                    ServerValue: newSLTValue.div(serverCurrencyRate),
                })
            }
        } catch {}
    }

    const handleServerValueChange = ({ value }) => {
        try {
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
        } catch {}
    }

    const resetValues = () => {
        setValues({
            ...values,
            KAPPA: '',
            ServerValue: '',
        })
    }

    const handleWithdraw = () => {
        if (!values.nickname) {
            return toast.error('Поле nickname не может быть пустым')
        }

        if (!values.ServerValue || values.ServerValue.lte(0)) {
            return toast.error('Значение должно быть больше 0')
        }

        if (values.ServerValue.gt(serverBalance)) {
            return toast.error('Недостаточно на балансе')
        }

        ServerApi.withdraw(values.serverId, web3.account, values.nickname, values.ServerValue.toString())
            .then((data) => {
                setServerBalance(BigNumber.from(data.newBalance))
                toast.success('Success')
            })
            .catch(err => toast.error(err.message))
    }

    const handleChange = ({ id, value }) => {
        setValues({
            ...values,
            [id]: value,
        })
    }

    useEffect(() => {
        if (values.nickname) {
            ServerApi.balanceOf(values.nickname)
                .then(data => {
                    setServerBalance(BigNumber.from(data.balance))
                })
                .catch(err => toast.error(err.message))
        }
    }, [values.nickname])

    return (
        <SwapWrapper>
            <SwapHeader>
                <Link to='/deposit'>Deposit</Link>
                <Link to='/withdraw' className='active'>Withdraw</Link>
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
                    id="server-amount"
                    label={`Ocean of Anarchy (${serverBalance.toString()})`}
                    value={values.ServerValue.toString()}
                    onChange={handleServerValueChange}
                />
                <Input
                    id="SLT-amount"
                    label={`KAPPA`}
                    value={values.KAPPA.toString()}
                    onChange={handleKAPPAChange}
                />
            </SwapContent>
            <Hidden isHidden={web3.active}>
                <ConnectButton />
            </Hidden>
            <Hidden isHidden={!web3.active}>
                <Button onClick={handleWithdraw}>Withdraw</Button>
            </Hidden>
        </SwapWrapper>
    )
}

export default Withdraw
