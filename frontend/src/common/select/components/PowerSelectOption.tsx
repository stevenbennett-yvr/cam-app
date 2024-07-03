import { Power } from "@typing/content";
import { useRecoilState } from "recoil";
import { drawerState } from "@atoms/navAtoms";
import { kindredState } from "@atoms/kindredAtoms";
import { Text, Group, Badge, HoverCard } from "@mantine/core";
import BaseSelectionOption from "./BaseSelectionOption";

export default function PowerSelectionOption(props: {
    power: Power;
    onClick?: (power: Power) => void;
    selected?: boolean;
    hasSelected?: boolean;
    showButton?: boolean;
    includeOptions?: boolean;
    onDelete?: (id: number) => void;
    onCopy?: (id: number) => void;
    note?: string;
    noBackground?: boolean;
    px?: number;
}) {
    const [_drawer, openDrawer] = useRecoilState(drawerState);

    return (
        <BaseSelectionOption
            leftSection={
                <HoverCard width={300} shadow="md" zIndex={5000}>
                    <HoverCard.Target>
                        <Group wrap="nowrap">
                            <div style={{ flex: 1 }}>
                                <Text size='sm' fw={500}>
                                    {props.power.name}
                                </Text>
                            </div>
                        </Group>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                        <Text size="sm">
                            {props.power.summary}
                        </Text>
                    </HoverCard.Dropdown>
                </HoverCard>
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
            noBackground={props.noBackground}
            onClick={
                props.onClick
                  ? () =>
                      openDrawer({
                        type: 'power',
                        data: {
                          id: props.power.id,
                          onSelect:
                            props.showButton || props.showButton === undefined ? () => props.onClick?.(props.power) : undefined,
                        },
                        extra: { addToHistory: true },
                      })
                  : () => {}
              }
            buttonTitle="Select"
            disableButton={props.selected}
            onButtonClick={props.onClick ? () => props.onClick?.(props.power) : undefined}
            includeOptions={props.includeOptions}
            onOptionsDelete={props.onDelete ? () => props.onDelete?.(props.power.id) : undefined}
            onOptionsCopy={props.onCopy ? () => props.onCopy?.(props.power.id) : undefined}
            px={props.px}
        />
    )
}



