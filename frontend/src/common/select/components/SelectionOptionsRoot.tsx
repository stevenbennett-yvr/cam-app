import SectSelectionOption from "./SectSelectOption";

import { ContentType } from "@typing/content";
import { Sect } from "@typing/content";


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

