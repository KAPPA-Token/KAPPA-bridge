import React from 'react'

import { InputWrapper } from './styled'

const Input = ({ id, value, label, placeholder = '0.0', onChange }) => {
    const handleChange = (e) => {
        onChange({ id, value: e.target.value })
    }

    return (
        <InputWrapper>
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
            />
        </InputWrapper>
    )
}

export default Input
