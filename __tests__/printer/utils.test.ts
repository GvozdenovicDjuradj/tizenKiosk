import {searchModelInfoByModelName} from "../../src/printer/utils"

describe(`the utils module`, () => {
    describe(`the searchModelInfoByModelName function`, () => {
        it(`should return the model info for a perfect match`, () => {
            // Given
            const modelName = "mPOP"

            // When
            const result = searchModelInfoByModelName(modelName)

            // Then
            expect(result).toHaveProperty("modelTitle", "mPOP")
            expect(result).toHaveProperty("defaultPaperWidth", 384)
            expect(result).toHaveProperty("emulation", "StarPRNT")
            expect(result).toHaveProperty("names", ["STAR mPOP-", "mPOP"])
        });

        it(`should return the model info for a partial match`, () => {
            // Given
            const modelName = "STAR mP"

            // When
            const result = searchModelInfoByModelName(modelName)

            // Then
            expect(result).toHaveProperty("modelTitle", "mPOP")
            expect(result).toHaveProperty("defaultPaperWidth", 384)
            expect(result).toHaveProperty("emulation", "StarPRNT")
            expect(result).toHaveProperty("names", ["STAR mPOP-", "mPOP"])
        });

        it(`should return the model info for a title match`, () => {
            // Given
            const modelName = "FVP10"

            // When
            const result = searchModelInfoByModelName(modelName)

            // Then
            expect(result).toHaveProperty("modelTitle", "FVP10")
            expect(result).toHaveProperty("defaultPaperWidth", 576)
            expect(result).toHaveProperty("emulation", "StarLine")
            expect(result).toHaveProperty("names", ["FVP10 (STR_T-001)", "Star FVP10"])
        })

        it(`should return the model info for a bluetooth model`, () => {
            // Given
            const modelName = "BT:mC-Print2-J0173"

            // When
            const result = searchModelInfoByModelName(modelName)

            // Then
            expect(result).toHaveProperty("modelTitle", "mC-Print2")
            expect(result).toHaveProperty("defaultPaperWidth", 384)
            expect(result).toHaveProperty("emulation", "StarPRNT")
        })

        it.each`
        modelName                       | expectedModelTitle               | expectedDefaultPaperWidth | expectedEmulation
        ${"mPOP"}                       | ${"mPOP"}                        | ${384}                    | ${"StarPRNT"}
        ${"FVP10"}                      | ${"FVP10"}                       | ${576}                    | ${"StarLine"}
        ${"TSP100"}                     | ${"TSP100"}                      | ${576}                    | ${"StarGraphic"}
        ${"TSP650II"}                   | ${"TSP650II"}                    | ${576}                    | ${"StarLine"}
        ${"TSP700II"}                   | ${"TSP700II"}                    | ${576}                    | ${"StarLine"}
        ${"TSP800II"}                   | ${"TSP800II"}                    | ${832}                    | ${"StarLine"}
        ${"SP700"}                      | ${"SP700"}                       | ${210}                    | ${"StarDotImpact"}
        ${"SM-S210i"}                   | ${"SM-S210i"}                    | ${384}                    | ${"EscPosMobile"}
        ${"SM-S220i"}                   | ${"SM-S220i"}                    | ${384}                    | ${"EscPosMobile"}
        ${"SM-S230i"}                   | ${"SM-S230i"}                    | ${384}                    | ${"EscPosMobile"}
        ${"SM-T300i/T300"}              | ${"SM-T300i/T300"}               | ${576}                    | ${"EscPosMobile"}
        ${"SM-T400i"}                   | ${"SM-T400i"}                    | ${832}                    | ${"EscPosMobile"}
        ${"SM-L200"}                    | ${"SM-L200"}                     | ${384}                    | ${"StarPRNT"}
        ${"BSC10"}                      | ${"BSC10"}                       | ${512}                    | ${"EscPos"}
        ${"SM-S210i StarPRNT"}          | ${"SM-S210i StarPRNT"}           | ${384}                    | ${"StarPRNT"}
        ${"SM-S220i StarPRNT"}          | ${"SM-S220i StarPRNT"}           | ${384}                    | ${"StarPRNT"}
        ${"SM-S230i StarPRNT"}          | ${"SM-S230i StarPRNT"}           | ${384}                    | ${"StarPRNT"}
        ${"SM-T300i StarPRNT"}          | ${"SM-T300i StarPRNT"}           | ${576}                    | ${"StarPRNT"}
        ${"SM-T400i StarPRNT"}          | ${"SM-T400i StarPRNT"}           | ${832}                    | ${"StarPRNT"}
        ${"SM-L300"}                    | ${"SM-L300"}                     | ${576}                    | ${"StarPRNTL"}
        ${"mC-Print2"}                  | ${"mC-Print2"}                   | ${384}                    | ${"StarPRNT"}
        ${"mC-Print3"}                  | ${"mC-Print3"}                   | ${576}                    | ${"StarPRNT"}
        ${"TUP500"}                     | ${"TUP500"}                      | ${576}                    | ${"StarLine"}
        ${"SK1-211/221/V211"}           | ${"SK1-211/221/V211"}            | ${432}                    | ${"StarPRNT"}
        ${"SK1-211/221/V211 Presenter"} | ${"SK1-211/221/V211 Presenter"}  | ${432}                    | ${"StarPRNT"}
        ${"SK1-311/321/V311"}           | ${"SK1-311/321/V311"}            | ${576}                    | ${"StarPRNT"}
        ${"SK1-311/V311 Presenter"}     | ${"SK1-311/V311 Presenter"}      | ${576}                    | ${"StarPRNT"}
    `(`should return $expectedModelTitle,
    $expectedDefaultPaperWidth and $expectedEmulation when $modelName is searched`,
          ({modelName, expectedModelTitle, expectedDefaultPaperWidth, expectedEmulation}) => {
              // When
              const result = searchModelInfoByModelName(modelName)

              // Then
              expect(result).toHaveProperty("modelTitle", expectedModelTitle)
              expect(result).toHaveProperty("modelTitle", expectedModelTitle)
              expect(result).toHaveProperty("defaultPaperWidth", expectedDefaultPaperWidth)
              expect(result).toHaveProperty("emulation", expectedEmulation)
          })
    });
})
