import { Background } from "@typing/content";
import { useRecoilState } from "recoil";
import { drawerState } from "@atoms/navAtoms";
import { kindredState } from "@atoms/kindredAtoms";
import { Text, Group, Badge, HoverCard } from "@mantine/core";
import BaseSelectionOption from "./BaseSelectionOption";

export default function BackgroundSelectionOption(props: {
    background: Background;
    onClick: (power: Background) => void;
    selected?: boolean;
    hasSelected?: boolean;
    showButton?: boolean;
    includeOptions?: boolean;
    onDelete?: (id: number) => void;
    onCopy?: (id: number) => void;
    note?: string;
}) {
    const [_drawer, openDrawer] = useRecoilState(drawerState);
    const kindred = useRecoilState(kindredState)

    const onSelect = () => {
        props.onClick(props.background)
    }

    return (

        <BaseSelectionOption
            leftSection={
                <Group wrap="nowrap">
                    <div style={{ flex: 1 }}>
                        <Text size='sm' fw={500}>
                            {props.background.name}
                        </Text>
                    </div>
                </Group>

            }
            rightSection={
                props.note && (
                    <Badge
                        variant='dot'
                        color='gray.5'
                        size={'md'}
                    >
                        {props.note}
                    </Badge>
                )
            }
            showButton={props.showButton}
            selected={props.selected}
            onClick={() =>
                openDrawer({
                    type: 'background',
                    data: {
                        id: props.background.id,
                        background: props.background,
                        onSelect: props.showButton || props.showButton === undefined ? () => onSelect() : undefined,
                    },
                    extra: { addToHistory: true }
                })
            }
            buttonTitle="Select"
            disableButton={props.selected}
            onButtonClick={() => onSelect()}
            includeOptions={props.includeOptions}
            onOptionsDelete={() => props.onDelete?.(props.background.id)}
            onOptionsCopy={() => props.onCopy?.(props.background.id)}
        />

    )
}


