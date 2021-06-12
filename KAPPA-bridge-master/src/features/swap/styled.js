import styled from 'styled-components'

export const SwapWrapper = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;

  width: 400px;
  border-radius: 10px;
  background-color: #284251;
`

export const SwapHeader = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 20px;
  width: 100%;
  border-bottom: 2px solid #386179;

  a {
    display: block;
    width: 50%;
    text-align: center;
    color: #fff;
    text-decoration: none;
    padding: 10px 20px;
    transition: background-color 100ms;

    :hover {
      background-color: #1c303c;
    }

    :nth-child(1) {
      border-radius: 10px 0 0 0;
    }

    :nth-child(2) {
      border-radius: 0 10px 0 0;
    }

    &.active {
      background-color: #1c303c;
    }
  }
`

export const SwapContent = styled.div`
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  justify-content: middle;
`
