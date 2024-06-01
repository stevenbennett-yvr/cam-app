import SectSelectionOption from "./SectSelectOption";

import { ContentType, Loresheet } from "@typing/content";
import { Sect, Clan } from "@typing/content";
import ClanSelectionOption from "./ClanSelectOption";
import { LoresheetSelectOption } from "./LoresheetSelectOption";


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

