import { enumToTitle, humanToPascal, normalize, titleCase } from '../strings';

describe('string helpers', () => {

    it('normalizes odd strings', () => {
        const oddStr = `

Bacon ipsum dolor amet meatball								kielbasa tail andouille tri-tip corned beef spare ribs venison chicken pastrami ribeye. Bacon ham hock t-bone pork. Bresaola picanha							burgdoggen pork tenderloin jowl. Jerky ball tip pork loin drumstick beef turducken meatloaf biltong chislic bacon porchetta








salami. Tri-tip cupim bresaola, alcatra chuck cow salami biltong pork belly.`;

        const expected = `Bacon ipsum dolor amet meatball kielbasa tail andouille tri-tip corned beef spare ribs venison chicken pastrami ribeye. Bacon ham hock t-bone pork. Bresaola picanha burgdoggen pork tenderloin jowl. Jerky ball tip pork loin drumstick beef turducken meatloaf biltong chislic bacon porchetta salami. Tri-tip cupim bresaola, alcatra chuck cow salami biltong pork belly.`;
        expect(normalize(oddStr)).toBe(expected);
    });

    it('titleCases', () => {
        const inputStr = `tHiS iS nOt tItLe 
        Case`;
        const expected = 'This Is Not Title Case';
        expect(titleCase(inputStr)).toBe(expected);
    });

    it('converts enums to Title Case', () => {
        const inputStr = `THIS_IS__NOT
        _TITLE_CASE`;
        const expected = 'This Is Not Title Case';
        expect(enumToTitle(inputStr)).toBe(expected);
    });

    it('converts human sentences to pascal case (ClassNameCase)', () => {
        const inputStr = `this is a sentence typed by a human with spaces and other 
        characters`;
        const expected = 'ThisIsASentenceTypedByAHumanWithSpacesAndOtherCharacters';
        expect(humanToPascal(inputStr)).toBe(expected);
    });

    it('safely passes invalid strings through', () => {
        expect(humanToPascal('')).toBe('');
        // @ts-ignore
        expect(humanToPascal(null)).toBe(null);
        // @ts-ignore
        expect(humanToPascal(void 0)).toBe(undefined);
    });
});
