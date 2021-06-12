import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { createGlobalStyle } from 'styled-components'
import { Web3ReactProvider } from '@web3-react/core'
import { ToastContainer } from 'react-toastify'
import {
  HashRouter as Router,
  BrowserRouter as BrowserRouter,
  Switch,
  Route
} from 'react-router-dom'

import 'react-toastify/dist/ReactToastify.css'

import App from './App'
import Home from './features/home/Home'
import Deposit from './features/bridge/Deposit'
import Withdraw from './features/bridge/Withdraw'
import Swap from './features/swap/Swap'

import getLibrary from './utils/getLibrary'

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body, #root {
    width: 100%;
    height: 100vh;
    background-color: #386179;
    color: #fff;
    font-family: Arial;
  }

  body {
    margin: 0;
  }
`

ReactDOM.render(
    <App>
        <GlobalStyle />
        <Web3ReactProvider getLibrary={getLibrary}>
          <BrowserRouter>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path="/bridge"
              render={() => (
                <Router>
                  <Switch>
                    <Route exact path={["/", "/deposit"]} render={() => <Deposit />} />
                    <Route exact path="/withdraw" render={() => <Withdraw />} />
                  </Switch>
                </Router>
              )}
            />
            <Route exact path="/swap" component={Swap} />
          </BrowserRouter>
        </Web3ReactProvider>
        <ToastContainer
          position='top-center'
          autoClose={2000}
        />
    </App>,
    document.querySelector('#root')
)
