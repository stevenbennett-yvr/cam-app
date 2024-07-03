import SectSelectionOption from "./SectSelectOption";

import { Background, ContentType, Discipline, Loresheet, MeritFlaw, Power } from "@typing/content";
import { Sect, Clan } from "@typing/content";
import ClanSelectionOption from "./ClanSelectOption";
import { LoresheetSelectOption } from "./LoresheetSelectOption";
import BackgroundSelectionOption from "./BackgroundSelectOption";
import MeritFlawSelectionOption from "./MeritFlawSelectOption";
import DisciplineSelectionOption from "./DisciplineSelectionOption";
import PowerSelectionOption from "./PowerSelectOption";


export default function SelectionOptionsRoot(props: {
    options: Record<string, any>[];
    type: ContentType;
    onClick: (option: Record<string, any>) => void;
    selectedId?: number;
    includeOptions?: boolean;
    showButton?: boolean;
    onDelete?: (id: number) => void;
    onCopy?: (id: number) => void;
}) {
    // Render appropriate options based on type
    if (props.type === 'sect') {
        return (
            <>
                {props.options.map((sect, index) => (
                    <SectSelectionOption
                        key={'class-' + index}
                        sect={sect as Sect}
                        onClick={props.onClick}
                        selected={props.selectedId === sect.id}
                        hasSelected={props.selectedId !== undefined}
                        showButton={props.showButton}
                        includeOptions={props.includeOptions}
                        onDelete={props.onDelete}
                        onCopy={props.onCopy}
                    />
                ))}
            </>
        );
    }
    if (props.type === 'clan') {
        return (
            <>
                {props.options.map((clan, index) => (
                    <ClanSelectionOption
                        key={'class-' + index}
                        clan={clan as Clan}
                        onClick={props.onClick}
                        selected={props.selectedId === clan.id}
                        hasSelected={props.selectedId !== undefined}
                        showButton={props.showButton}
                        includeOptions={props.includeOptions}
                        onDelete={props.onDelete}
                        onCopy={props.onCopy}
                    />
                ))}
            </>
        );
    }
    if (props.type === 'predator-type') {
        return (
            <>
                {props.options.map((sect, index) => (
                    <SectSelectionOption
                        key={'class-' + index}
                        sect={sect as Sect}
                        onClick={props.onClick}
                        selected={props.selectedId === sect.id}
                        hasSelected={props.selectedId !== undefined}
                        showButton={props.showButton}
                        includeOptions={props.includeOptions}
                        onDelete={props.onDelete}
                        onCopy={props.onCopy}
                    />
                ))}
            </>
        );
    }
    if (props.type === 'loresheet') {
        return (
            <>
                {props.options.map((loresheet, index) => (
                    <LoresheetSelectOption
                    key={'class-' + index}
                    loresheet={loresheet as Loresheet}
                    onClick={props.onClick}
                    selected={props.selectedId === loresheet.id}
                    hasSelected={props.selectedId !== undefined}
                    showButton={props.showButton}
                    includeOptions={props.includeOptions}
                    onDelete={props.onDelete}
                    onCopy={props.onCopy}
                    />
                ))}
            </>
        )
    }
    if (props.type === 'background') {
        return (
            <>
                {props.options.map((background, index) => (
                    <BackgroundSelectionOption
                    key={'class-' + index}
                    background={background as Background}
                    onClick={props.onClick}
                    selected={props.selectedId === background.id}
                    hasSelected={props.selectedId !== undefined}
                    showButton={props.showButton}
                    includeOptions={props.includeOptions}
                    onDelete={props.onDelete}
                    onCopy={props.onCopy}
                    />
                ))}
            </>
        )
    }
    if (props.type === 'merit_flaw') {
        return (
            <>
                {props.options.map((meritFlaw, index) => (
                    <MeritFlawSelectionOption
                    key={'class-' + index}
                    meritFlaw={meritFlaw as MeritFlaw}
                    onClick={props.onClick}
                    selected={props.selectedId === meritFlaw.id}
                    hasSelected={props.selectedId !== undefined}
                    showButton={props.showButton}
                    includeOptions={props.includeOptions}
                    onDelete={props.onDelete}
                    onCopy={props.onCopy}
                    />
                ))}
            </>
        )
    }
    if (props.type === 'discipline') {
        return (
            <>
                {props.options.map((discipline, index) => (
                    <DisciplineSelectionOption
                    key={'class-' + index}
                    discipline={discipline as Discipline}
                    onClick={props.onClick}
                    selected={props.selectedId === discipline.id}
                    hasSelected={props.selectedId !== undefined}
                    showButton={props.showButton}
                    includeOptions={props.includeOptions}
                    onDelete={props.onDelete}
                    onCopy={props.onCopy}
                    />
                ))}
            </>
        )
    }
    if (props.type === 'power') {
        return (
            <>
                {props.options.map((power, index) => (
                    <PowerSelectionOption
                    key={'class-' + index}
                    power={power as Power}
                    onClick={props.onClick}
                    selected={props.selectedId === power.id}
                    hasSelected={props.selectedId !== undefined}
                    showButton={props.showButton}
                    includeOptions={props.includeOptions}
                    onDelete={props.onDelete}
                    onCopy={props.onCopy}
                    />
                ))}
            </>
        )
    }

    // Generic ability block. Probably used for variables.
    return (
        <>
            {props.options.map((sect, index) => (
                <SectSelectionOption
                    key={'class-' + index}
                    sect={sect as Sect}
                    onClick={props.onClick}
                    selected={props.selectedId === sect.id}
                    hasSelected={props.selectedId !== undefined}
                    showButton={props.showButton}
                    includeOptions={props.includeOptions}
                    onDelete={props.onDelete}
                    onCopy={props.onCopy}
                />
            ))}
        </>
    );
}

