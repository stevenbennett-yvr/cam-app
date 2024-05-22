import { Sect } from "@typing/content";
import { useRecoilState } from "recoil";
import { drawerState } from "@atoms/navAtoms";
import { kindredState } from "@atoms/kindredAtoms";
import { modals } from "@mantine/modals";
import { Title, Text, Group, Avatar } from "@mantine/core";
import BaseSelectionOption from "./BaseSelectionOption";
import { supabase } from "../../../main";

export default function SectSelectionOption(props: {
    sect: Sect;
    onClick: (sect: Sect) => void;
    selected?: boolean;
    hasSelected?: boolean;
    showButton?: boolean;
    includeOptions?: boolean;
    onDelete?: (id: number) => void;
    onCopy?: (id: number) => void;
}) {
    const [_drawer, openDrawer] = useRecoilState(drawerState);
    const kindred = useRecoilState(kindredState)

    const openConfirmModal = () =>
        modals.openConfirmModal({
            id: 'change-option',
            title: <Title order={4}>Change Sect</Title>,
            children: (
                <Text size='sm'>
                    Are you sure you want to change your Sect?
                </Text>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onCancel: () => { },
            onConfirm: () => props.onClick(props.sect),
        });

    const onSelect = () => {
        if (props.hasSelected && !props.selected) {
            openConfirmModal()
        } else {
            props.onClick(props.sect)
        }
    }

    const url = supabase.storage.from('v5').getPublicUrl(props.sect.symbol).data.publicUrl

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
                                filter: 'invert(1)'
                            }
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <Text size='sm' fw={500}>
                            {props.sect.name}
                        </Text>

                    </div>
                </Group>
            }
            showButton={props.showButton}
            selected={props.selected}
            onClick={() =>
                openDrawer({
                    type: 'sect',
                    data: {
                        id: props.sect.id,
                        onSelect: props.showButton || props.showButton === undefined ? () => onSelect() : undefined,
                    },
                    extra: { addToHistory: true }
                })
            }
            buttonTitle="Select"
            disableButton={props.selected}
            onButtonClick={() => onSelect()}
            includeOptions={props.includeOptions}
            onOptionsDelete={() => props.onDelete?.(props.sect.id)}
            onOptionsCopy={() => props.onCopy?.(props.sect.id)}
        />
    )
}



