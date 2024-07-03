import { MeritFlaw } from "@typing/content";
import { useRecoilState } from "recoil";
import { drawerState } from "@atoms/navAtoms";
import { kindredState } from "@atoms/kindredAtoms";
import { Text, Group, Badge, HoverCard } from "@mantine/core";
import BaseSelectionOption from "./BaseSelectionOption";
import { levelsDisplay } from "@utils/dots";

export default function MeritFlawSelectionOption(props: {
    meritFlaw: MeritFlaw;
    onClick: (meritFlaw: MeritFlaw) => void;
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
        props.onClick(props.meritFlaw)
    }

    return (

        <BaseSelectionOption
            leftSection={
                <Group wrap="nowrap">
                    <div style={{ flex: 1 }}>
                        <Text size='sm' fw={500}>
                            {props.meritFlaw.name} {` ${levelsDisplay(props.meritFlaw.levels)}`}
                        </Text>
                    </div>
                </Group>
            }
            rightSection={
                (
                    <Badge
                        variant='dot'
                        color='gray.5'
                        size={'md'}
                    >
                        {props.meritFlaw.category}
                    </Badge>
                )
            }
            showButton={props.showButton}
            selected={props.selected}
            onClick={() =>
                openDrawer({
                    type: 'merit_flaw',
                    data: {
                        id: props.meritFlaw.id,
                        onSelect: props.showButton || props.showButton === undefined ? () => onSelect() : undefined,
                    },
                    extra: { addToHistory: true }
                })
            }
            buttonTitle="Select"
            disableButton={props.selected}
            onButtonClick={() => onSelect()}
            includeOptions={props.includeOptions}
            onOptionsDelete={() => props.onDelete?.(props.meritFlaw.id)}
            onOptionsCopy={() => props.onCopy?.(props.meritFlaw.id)}
        />

    )
}



