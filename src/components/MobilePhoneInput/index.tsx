import {
  CCA2Code,
  Country,
  getAllCountries
} from "react-native-country-picker-modal"

export { CCA2Code }

interface CountryExtended extends Country {
  cca2: CCA2Code
}

export const getAllCountriesExtended = (): CountryExtended[] => {
  return getAllCountries() as CountryExtended[]
}
