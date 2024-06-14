import { BackgroundBenefit } from "@typing/content";
import { useRecoilState } from "recoil";
import { drawerState } from "@atoms/navAtoms";
import { kindredState } from "@atoms/kindredAtoms";
import { Text, Group, Badge, HoverCard } from "@mantine/core";
import BaseSelectionOption from "./BaseSelectionOption";

export default function BackgroundBenefitSelectionOption(props: {
    benefit: BackgroundBenefit;
    onClick: (benefit: BackgroundBenefit) => void;
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
        props.onClick(props.benefit)
    }

    return (

        <BaseSelectionOption
            leftSection={
                        <Group wrap="nowrap">
                            <div style={{ flex: 1 }}>
                                <Text size='sm' fw={500}>
                                    {props.benefit.name}
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
                    type: 'background_benefit',
                    data: {
                        id: props.benefit.id,
                        onSelect: props.showButton || props.showButton === undefined ? () => onSelect() : undefined,
                    },
                    extra: { addToHistory: true }
                })
            }
            buttonTitle="Select"
            disableButton={props.selected}
            onButtonClick={() => onSelect()}
            includeOptions={props.includeOptions}
            onOptionsDelete={() => props.onDelete?.(props.benefit.id)}
            onOptionsCopy={() => props.onCopy?.(props.benefit.id)}
        />

    )
}


