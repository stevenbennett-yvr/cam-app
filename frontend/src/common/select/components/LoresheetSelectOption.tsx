import { drawerState } from "@atoms/navAtoms";
import { useMediaQuery } from "@mantine/hooks";
import { Loresheet } from "@typing/content";
import { phoneQuery } from "@utils/mobile-responsive";
import { useRecoilState } from "recoil";
import BaseSelectionOption from "./BaseSelectionOption";
import { Box, Text } from "@mantine/core";


export function LoresheetSelectOption(props: {
    loresheet: Loresheet;
    onClick?: (loresheet: Loresheet) => void;
    selected?: boolean;
    hasSelected?: boolean;
    includeOptions?: boolean;
    showButton?: boolean;
    noBackground?: boolean;
    exhausted?: boolean;
    onDelete?: (id: number) => void;
    onCopy?: (id: number) => void;
}) {
    const [_drawer, openDrawer] = useRecoilState(drawerState);
    const isPhone = useMediaQuery(phoneQuery());

    return (
        <BaseSelectionOption
            leftSection={
                <Box pl={8}>
                    <Text fz='sm' td={props.exhausted ? 'line-through' : undefined}>
                        {props.loresheet.name}
                    </Text>
                </Box>
            }
            showButton={props.showButton}
            selected={props.selected}
            disabled={props.exhausted}
            noBackground={props.noBackground}
            onClick={
                props.onClick
                    ? () =>
                        openDrawer({
                            type: 'loresheet',
                            data: {
                                id: props.loresheet.id,
                                onSelect:
                                    props.showButton || props.showButton === undefined ? () => props.onClick?.(props.loresheet) : undefined,
                            },
                            extra: { addToHistory: true },
                        })
                    : () => { }
            }
            buttonTitle="Select"
            disableButton={props.selected}
            onButtonClick={props.onClick ? () => props.onClick?.(props.loresheet) : undefined}
            includeOptions={props.includeOptions}
            onOptionsDelete={() => props.onDelete?.(props.loresheet.id)}
            onOptionsCopy={() => props.onCopy?.(props.loresheet.id)}
      
        />
    )
}