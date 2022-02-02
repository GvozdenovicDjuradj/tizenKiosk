import React, {FC, useState} from "react"
import {
    Modal,
    FlatList,
    Image,
    ImageURISource,
    TextInputChangeEventData,
    NativeSyntheticEvent, Platform, ImageSourcePropType
} from "react-native"
import styled from "styled-components/native"
import flags from "../../utils/flags"
import iso31662 from "../../../assets/iso-3166-2.json"
import {TextInput, TextInputContainer} from "./styles"
import {fonts} from "../../theme/fonts"
import {CountryCode} from "libphonenumber-js"

const CLOSE_ICON = require("../../../assets/icons/cancelled.png")

const Container = styled.View`
    display: flex;
    height: 100%;
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(52, 52, 52, 0.5);
    z-index:9;
`

const Content = styled.View`
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 4px;
    width: 40%;
    height: 700px;
    background-color: white;
    padding: 20px;
`

const ItemContainer = styled.TouchableOpacity`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const ItemImage = styled.Image`
    width: 32px;
    height: 32px;
    margin-right: 14px;
`

const HeaderContainer = styled.View`
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
`

const Filler = styled.View`
    width: 32px;
    height: 32px;
`

const CloseIcon = styled.TouchableOpacity`
    width: 32px;
    height: 32px;
`

const FilterContainer = styled(TextInputContainer)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 14px;
`

const Title = styled.Text`
    text-transform: uppercase;
    font-family: ${fonts.get("ubuntu")};
`

const CountryName = styled.Text`
    text-transform: uppercase;
    font-family: ${fonts.get("ubuntu")};
`

const DATA = Object.keys(flags).map((key) => ({
    id: key,
    title: iso31662[key.toUpperCase()] ? iso31662[key.toUpperCase()].name : "",
    image: flags[key]
})).filter((x) => x.title)

interface ItemProps {
    readonly onPress: () => void,
    readonly image: ImageURISource,
    readonly title: string
}

const Item: FC<ItemProps> = ({ onPress, image, title }) =>
    <ItemContainer onPress={onPress}>
        <ItemImage resizeMode="contain" source={image} />
        <CountryName>{title}</CountryName>
    </ItemContainer>

const CLOSE_IMAGE_HEIGHT_WIDTH = 32

export interface Props {
    readonly isOpen: boolean
    readonly onClose: () => void
    readonly onSelect: (countryCode: CountryCode) => void
}

const PhoneNumberCountryCodePickerModal: FC<Props> = ({ isOpen, onClose, onSelect }) => {
    const [countryFilter, setCountryFilter] = useState<undefined | string>(undefined)

    const onClosePress = () => {
        setCountryFilter(undefined)
        onClose()
    }

    const onItemPress = (item: string) => {
        setCountryFilter(undefined)
        onSelect(item.toUpperCase() as CountryCode)
    }

    const imageSource: ImageSourcePropType = Platform.OS === "web" ? {
        uri: CLOSE_ICON,
        width: CLOSE_IMAGE_HEIGHT_WIDTH,
        height: CLOSE_IMAGE_HEIGHT_WIDTH
    } : CLOSE_ICON

    return (
        <Modal
            animationType={"fade"}
            transparent={true}
            visible={isOpen}
            >
            <Container>
                <Content>
                    <HeaderContainer>
                        <Filler />
                        <Title>Select Phone Number Country</Title>
                        <CloseIcon onPress={onClosePress}>
                            <Image
                                height={CLOSE_IMAGE_HEIGHT_WIDTH}
                                width={CLOSE_IMAGE_HEIGHT_WIDTH}
                                source={imageSource} />
                        </CloseIcon>
                    </HeaderContainer>
                    <FilterContainer>
                        <TextInput
                            placeholder="Filter Countries"
                            value={countryFilter}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) =>
                                setCountryFilter(e.nativeEvent.text)}
                        />
                    </FilterContainer>
                    <FlatList
                        style={{ width: 322 }}
                        data={DATA.filter((x) =>
                            !countryFilter || x.title.toLowerCase().includes(countryFilter.toLowerCase()))}
                        renderItem={({item}) =>
                            <Item
                                title={item.title}
                                image={item.image}
                                onPress={() => onItemPress(item.id)}
                            />}
                        keyExtractor={(item) => item.id}
                    />
                </Content>
            </Container>
        </Modal>
    )
}

export default PhoneNumberCountryCodePickerModal
