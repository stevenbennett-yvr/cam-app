import { Discipline } from "@typing/content";
import { useRecoilState } from "recoil";
import { drawerState } from "@atoms/navAtoms";
import { kindredState } from "@atoms/kindredAtoms";
import { modals } from "@mantine/modals";
import { Title, Text, Group, Avatar, Badge } from "@mantine/core";
import BaseSelectionOption from "./BaseSelectionOption";
import { supabase } from "../../../main";

export default function DisciplineSelectionOption(props: {
    discipline: Discipline;
    onClick: (discipline: Discipline) => void;
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
            props.onClick(props.discipline)  
    }

    const url = supabase.storage.from('v5').getPublicUrl(props.discipline.rombo).data.publicUrl

    return (
        <BaseSelectionOption
            leftSection={
                <Group wrap="nowrap">
                    <Avatar
                        src={url}
                        radius='sm'
                        styles={{
                            image: {
                                objectFit: 'contain',
                            }
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <Text size='sm' fw={500}>
                            {props.discipline.name}
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
                    type: 'discipline',
                    data: {
                        id: props.discipline.id,
                        onSelect: props.showButton || props.showButton === undefined ? () => onSelect() : undefined,
                    },
                    extra: { addToHistory: true }
                })
            }
            buttonTitle="Select"
            disableButton={props.selected}
            onButtonClick={() => onSelect()}
            includeOptions={props.includeOptions}
            onOptionsDelete={() => props.onDelete?.(props.discipline.id)}
            onOptionsCopy={() => props.onCopy?.(props.discipline.id)}
        />
    )
}