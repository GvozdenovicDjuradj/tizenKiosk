import React from "react";
import { Image } from "react-native";
import styled from "styled-components/native";
import icons from "../../icons"
import { fonts } from "../../theme/fonts"

const Container = styled.TouchableOpacity<{ isEven: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 50px;
    padding-left: 11px;
    background-color: ${({isEven}) => isEven ? "white": "#fcfcfc"};
`;

const Text = styled.Text`
    font-family: ${fonts.get('ubuntu')};
`;

const CheckboxContainer = styled.View`
    margin-right: 10px;
`;

export interface Props {
    name: string;
    isEven: boolean;
    isSelected: boolean;
    onPress: () => void;
}

export default ({name, isEven, isSelected, onPress}: Props) =>
  <Container isEven={isEven} onPress={onPress}>
      <CheckboxContainer>
          <Image source={isSelected ? icons.checkboxOn : icons.checkboxOff} />
      </CheckboxContainer>
      <Text>
          {name}
      </Text>
  </Container>
