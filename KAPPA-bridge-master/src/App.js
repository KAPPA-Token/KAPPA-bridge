import React from 'react'
import styled from 'styled-components'

const AppWrapper = styled.div`
    display: flex;
    height: 100%;
`

const App = ({ children }) => {
    return (
        <AppWrapper>
            {children}
        </AppWrapper>
    )
}

export default App
