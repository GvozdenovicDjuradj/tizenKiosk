import styled from "styled-components/native"
import {fonts} from "../../theme/fonts"

export const TextInputContainer = styled.View<{ isValid?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 54px;
    width: 100%;
    flex-direction: row;
    border-radius: 4px;
    border-style: solid;
    border-width: 1px;
    border-color: ${({ isValid = true }) => isValid ? "#ced4da" : "red" };
    background-color: white;
    padding-left: 14px;
    padding-right: 14px;
`

export const TextInput = styled.TextInput`
    flex: 1;
    height: 100%;
    font-weight: normal;
    font-style: normal;
    color: #4a4a4a;
    font-family: ${fonts.get("ubuntu")};
    font-size: 26px;
    padding-left: 14px;
`
