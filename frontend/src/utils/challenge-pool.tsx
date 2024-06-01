import { ChallengePool } from "@typing/content";

export default function createChallengePool(data: ChallengePool): string {
    // Extract defense and offense values
    const defenseValues = data.defense;
    const offenseValues = data.offense;

    // Join the values with ' + ' and format the string
    const defenseStr = defenseValues?
        defenseValues.map(word => capitalize(word)).join(" + ")
        : "variable";
    const offenseStr = offenseValues.map(word => capitalize(word)).join(" + ");


    // Create the final output string
    let result = `${offenseStr} vs. ${defenseStr}`;

    if (data.note) {
        result += ` (${data.note})`
    }

    return result;
}

function capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
}