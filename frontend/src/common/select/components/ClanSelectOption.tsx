import { Clan } from "@typing/content";
import { useRecoilState } from "recoil";
import { drawerState } from "@atoms/navAtoms";
import { kindredState } from "@atoms/kindredAtoms";
import { modals } from "@mantine/modals";
import { Title, Text, Group, Avatar, Badge } from "@mantine/core";
import BaseSelectionOption from "./BaseSelectionOption";
import { supabase } from "../../../main";

export default function ClanSelectionOption(props: {
    clan: Clan;
    onClick: (clan: Clan) => void;
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

    const openConfirmModal = () =>
        modals.openConfirmModal({
            id: 'change-option',
            title: <Title order={4}>Change Clan</Title>,
            children: (
                <Text size='sm'>
                    Are you sure you want to change your Clan?
                </Text>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onCancel: () => { },
            onConfirm: () => props.onClick(props.clan),
        });

    const onSelect = () => {
        if (props.hasSelected && !props.selected) {
            openConfirmModal()
        } else {
            props.onClick(props.clan)
        }
    }

    const url = supabase.storage.from('v5').getPublicUrl(props.clan.symbol).data.publicUrl

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
                            {props.clan.name}
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
                    type: 'clan',
                    data: {
                        id: props.clan.id,
                        onSelect: props.showButton || props.showButton === undefined ? () => onSelect() : undefined,
                    },
                    extra: { addToHistory: true }
                })
            }
            buttonTitle="Select"
            disableButton={props.selected}
            onButtonClick={() => onSelect()}
            includeOptions={props.includeOptions}
            onOptionsDelete={() => props.onDelete?.(props.clan.id)}
            onOptionsCopy={() => props.onCopy?.(props.clan.id)}
        />
    )
}



