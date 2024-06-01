import { kindredState } from "@atoms/kindredAtoms";
import { drawerState } from "@atoms/navAtoms";
import { fetchClanDisciplines, fetchContentById, fetchContent } from "@content/content-store";
import { useQuery } from "@tanstack/react-query";
import { Clan, ClanDisciplines, Loresheet } from "@typing/content";
import { useRecoilState } from "recoil";
import { Blockquote, Group, Box, Text, Button, Loader, Stack, useMantineTheme, Avatar, Image, TypographyStylesProvider, Divider, Title, Accordion, Badge, Anchor } from "@mantine/core";
import { useState } from "react";
import { supabase } from "../../main";
import IndentedText from "@common/IndentedText";
import { getMetadataOpenedDict } from "@drawers/drawer-utils";
import { LoresheetSelectOption } from "@common/select/components/LoresheetSelectOption";

export function ClanDrawerTitle(props: { data: { id?: number; clan?: Clan; onSelect?: () => void } }) {
    const id = props.data.id;

    const [_drawer, openDrawer] = useRecoilState(drawerState)

    const { data: _clan } = useQuery({
        queryKey: [`find-clan-${id}`, { id }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            // eslint-disable-next-line
            const [_key, { id }] = queryKey;
            return await fetchContentById<Clan>('clan', id);
        },
        enabled: !!id,
    })
    const clan = props.data.clan ?? _clan;


    if (!_clan) {
        return (
            <Loader
                type='bars'
                style={{
                    position: 'absolute',
                    top: '35%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            />
        );
    }

    const logoUrl = supabase.storage.from('v5').getPublicUrl(_clan.logo).data.publicUrl

    return (
        <>
            {clan && (
                <Group justify="center" wrap='nowrap'>

                    {logoUrl && (
                        <Image
                            style={{
                                float: 'left',
                                height: 'auto',
                                maxWidth: '60%',
                                objectFit: 'contain',
                                filter: 'invert(1)'
                            }}
                            ml='sm'
                            radius='md'
                            fit='contain'
                            src={logoUrl}
                        />
                    )}

                    {props.data.onSelect && (
                        <Button
                            variant="filled"
                            radius='xl'
                            mb={5}
                            size='compact-sm'
                            onClick={() => {
                                props.data.onSelect?.();
                                openDrawer(null);
                            }}
                        >
                            Select Clan
                        </Button>
                    )}
                </Group>
            )}
        </>
    )
}

export function ClanDrawerContent(props: {
    data: { id?: number; clan?: Clan; };
    onMetadataChange?: (openedDict?: Record<string, string>) => void;
}) {
    const id = props.data.id;
    const [_drawer, openDrawer] = useRecoilState(drawerState)

    const { data } = useQuery({
        queryKey: [`find-clan-details-${id}`, { id }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            // eslint-disable-next-line
            const [_key, { id }] = queryKey;
            const clan = await fetchContentById<Clan>('clan', id);
            const clanDisciplines = await fetchClanDisciplines(id);
            const clanLoresheets = await fetchContent<Loresheet[]>('loresheet', { clan_id: id });
            return {
                clan: props.data.clan ?? clan,
                clanDisciplines,
                clanLoresheets
            }
        },
    })

    if (!data || !data.clan || !data.clanDisciplines || !data.clanLoresheets) {
        return (
            <Loader
                type='bars'
                style={{
                    position: 'absolute',
                    top: '35%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            />
        );
    }

    return (
        <Stack>
            <ClanInitialOverview
                clan={data.clan}
                clanDisciplines={data.clanDisciplines}
                mode='READ'
            />
            {data.clanLoresheets.length > 0 && (
                <Box>
                    <Title order={3}>Exclusive Loresheets</Title>
                    <Accordion
                        variant="seperated"
                        defaultValue={getMetadataOpenedDict().clans_opened}
                        onChange={(value) => {
                            props.onMetadataChange?.({
                                clans_opened: value ?? "",
                            });
                        }}
                    >
                        <Accordion.Item value={"clans"}>
                            <Accordion.Control>
                                <Group wrap='nowrap' justify='space-between' gap={0}>
                                    <Text c='gray.5' fw={700} fz='md'>
                                        View Options
                                    </Text>
                                    <Badge mr='sm' variant='outline' color='gray.5' size='xs'>
                                        <Text fz='sm' c='gray.5' span>
                                            {data.clanLoresheets.length}
                                        </Text>
                                    </Badge>
                                </Group>
                            </Accordion.Control>
                            <Accordion.Panel
                                styles={{
                                    content: {
                                        padding: 0,
                                    }
                                }}
                            >
                                <Stack gap={0}>
                                    <Divider color="dark.6" />
                                    {data.clanLoresheets.map((loresheet, index) => (
                                        <LoresheetSelectOption
                                            key={index}
                                            loresheet={loresheet}
                                            showButton={false}
                                            onClick={() => {
                                                props.onMetadataChange?.();
                                                openDrawer({
                                                    type: 'loresheet',
                                                    data: { id: loresheet.id },
                                                    extra: { addToHistory: true }
                                                })
                                            }}
                                        />
                                    ))
                                    }
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </Box>
            )}

        </Stack>
    )

}


export function ClanInitialOverview(props: {
    clan: Clan;
    clanDisciplines: ClanDisciplines[];
    mode: 'READ' | 'READ/WRITE'
}) {
    const theme = useMantineTheme();
    const [descHidden, setDescHidden] = useState(true);
    const kindred = useRecoilState(kindredState);
    const [_drawer, openDrawer] = useRecoilState(drawerState);

    const artworkUrl = supabase.storage.from('v5').getPublicUrl(props.clan.artwork).data.publicUrl

    return (
        <>
            <Box
                style={{
                    position: 'relative'
                }}
            >
                <Box
                    mah={descHidden ? 400 : undefined}
                    style={{
                        WebkitMaskImage: descHidden ? 'linear-gradient(to bottom, black 60%, transparent 100%)' : undefined,
                        maskImage: descHidden ? 'linear-gradient(to bottom, black 60%, transparent 100%)' : undefined,
                        overflowY: descHidden ? 'hidden' : undefined,
                    }}
                >
                    {props.clan.artwork && (
                        <Image
                            style={{
                                float: 'right',
                                maxWidth: '100%',
                                height: 'auto',
                            }}
                            ml='sm'
                            radius='md'
                            fit='contain'
                            src={artworkUrl}
                        />
                    )}
                </Box>
                {props.clan.description && (
                    <Box py={5}>
                        <Divider
                            px='xs'
                            label={
                                <Text fz='xs' c='gray.6'>
                                    <Group gap={5}>
                                        <Box>Description</Box>
                                    </Group>
                                </Text>
                            }
                            labelPosition='left'
                        />
                        <Blockquote color="red">
                            <TypographyStylesProvider>
                                <Text dangerouslySetInnerHTML={{ __html: props.clan.description }} size="sm" />
                            </TypographyStylesProvider>
                        </Blockquote>
                    </Box>
                )}
                <Box py={5}>
                    <Divider
                        px='xs'
                        label={
                            <Text fz='xs' c='gray.6'>
                                <Group gap={5}>
                                    <Box>Disciplines</Box>
                                </Group>
                            </Text>
                        }
                        labelPosition='left'
                    />
                    <Stack gap="sm">
                        {props.clanDisciplines.map((clanDiscipline, index) => (
                            <Box style={{ display: 'flex' }} key={index}>
                                <Avatar
                                    src={
                                        supabase.storage.from('v5').getPublicUrl(clanDiscipline.discipline.rombo).data.publicUrl
                                    }
                                    style={{
                                        marginRight: '10px'
                                    }}
                                />
                                <Text size="sm">
                                    <Anchor
                                        fz='sm'
                                        onClick={() => {
                                            openDrawer({
                                                type: 'discipline',
                                                data: { id: clanDiscipline.discipline_id },
                                                extra: { addToHistory: true }
                                            })
                                        }}
                                    >
                                        {clanDiscipline.discipline.name}
                                    </Anchor>
                                    {clanDiscipline.note}
                                </Text>
                            </Box>
                        ))}
                    </Stack>
                </Box>
                {props.clan.characteristics && (
                <>
                    {props.clan.characteristics.map((characteristic, index) => (
                        <Box py={5} key={index}>
                            <Divider
                                px={'xs'}
                                label={
                                    <Text fz={'xs'} c={'gray.6'}>
                                        <Group>
                                            <Box>{characteristic.label}</Box>
                                        </Group>
                                    </Text>
                                }
                                labelPosition="left"
                            />
                            <TypographyStylesProvider>
                                <Text dangerouslySetInnerHTML={{ __html: characteristic.text }} size="sm" />
                            </TypographyStylesProvider>
                        </Box>
                    ))}
                </>
            )}
                <Box py={5}>
                    <Divider
                        px='xs'
                        label={
                            <Text fz='xs' c='gray.6'>
                                <Group gap={5}>
                                    <Box>Bane</Box>
                                </Group>
                            </Text>
                        }
                        labelPosition='left'
                    />
                    <IndentedText>
                        <Text size="sm">
                            {props.clan.bane}
                        </Text>
                    </IndentedText>
                </Box>
                <Box py={5}>
                    <Divider
                        px='xs'
                        label={
                            <Text fz='xs' c='gray.6'>
                                <Group gap={5}>
                                    <Box>Compulsion</Box>
                                </Group>
                            </Text>
                        }
                        labelPosition='left'
                    />
                    <IndentedText>
                        <Text size="sm">
                            {props.clan.compulsion}
                        </Text>
                    </IndentedText>
                </Box>
            </Box>
        </>
    )
}

