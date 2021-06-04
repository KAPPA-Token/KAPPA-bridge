import styled from 'styled-components'

export const Button = styled.button`
  border: none;
  background-color: tomato;
  margin: 15px;
  margin-top: 0;
  line-height: 30px;
  font-size: 25px;
  border-radius: 15px;
  padding: 10px;
  cursor: pointer;
  color: #fff;
  
  :disabled {
    background-color: #bb5441;
  }
`
