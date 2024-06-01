import { kindredState } from "@atoms/kindredAtoms";
import { drawerState } from "@atoms/navAtoms";
import { fetchContent, fetchContentAll, fetchContentById, fetchSectClans } from "@content/content-store";
import { useQuery } from "@tanstack/react-query";
import { Sect, Loresheet } from "@typing/content";
import { useRecoilState } from "recoil";
import { Blockquote, Group, Box, Text, Button, Loader, Stack, useMantineTheme, Image, TypographyStylesProvider, Divider, Title, Accordion, Badge } from "@mantine/core";
import { useState } from "react";
import { supabase } from "../../main";
import { getMetadataOpenedDict } from "@drawers/drawer-utils";
import ClanSelectionOption from "@common/select/components/ClanSelectOption";
import { LoresheetSelectOption } from "@common/select/components/LoresheetSelectOption";

export function SectDrawerTitle(props: { data: { id?: number; sect?: Sect; onSelect?: () => void } }) {
    const id = props.data.id;

    const [_drawer, openDrawer] = useRecoilState(drawerState)

    const { data: _sect } = useQuery({
        queryKey: [`find-sect-${id}`, { id }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            // eslint-disable-next-line
            const [_key, { id }] = queryKey;
            return await fetchContentById<Sect>('sect', id);
        },
        enabled: !!id,
    })
    const sect = props.data.sect ?? _sect;


    if (!_sect) {
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

    const logoUrl = supabase.storage.from('v5').getPublicUrl(_sect.logo).data.publicUrl

    return (
        <>
            {sect && (
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
                            Select Sect
                        </Button>
                    )}
                </Group>
            )}
        </>
    )
}

export function SectDrawerContent(props: {
    data: { id?: number; sect?: Sect; };
    onMetadataChange?: (openedDict?: Record<string, string>) => void;
}) {

    const [_drawer, openDrawer] = useRecoilState(drawerState)
    const id = props.data.id;

    const { data } = useQuery({
        queryKey: [`find-sect-details-${id}`, { id }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            // eslint-disable-next-line
            const [_key, { id }] = queryKey;
            const sect = await fetchContentById<Sect>('sect', id);
            const sectClans = await fetchSectClans(id);
            const sectLoresheets = await fetchContent<Loresheet[]>('loresheet', { sect_id: id });
            return {
                sect: props.data.sect ?? sect,
                sectClans,
                sectLoresheets
            }
        },
    })

    if (!data || !data.sect || !data.sectClans || !data.sectLoresheets) {
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
            <SectInitialOverview
                sect={data.sect}
                mode='READ'
            />
            <Box>
                <Title order={3}>Clans</Title>
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
                                        {data.sectClans.length}
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
                                {data.sectClans.map((sectClan, index) => (
                                    <ClanSelectionOption
                                        key={index}
                                        clan={sectClan.clan}
                                        note={sectClan.note}
                                        showButton={false}
                                        onClick={() => {
                                            props.onMetadataChange?.();
                                            openDrawer({
                                                type: 'clan',
                                                data: { id: sectClan.clan.id },
                                                extra: { addToHistory: true },
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
            {data.sectLoresheets.length > 0 && (
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
                                            {data.sectLoresheets.length}
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
                                    {data.sectLoresheets.map((loresheet, index) => (
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


export function SectInitialOverview(props: {
    sect: Sect;
    mode: 'READ' | 'READ/WRITE'
}) {
    const theme = useMantineTheme();
    const [descHidden, setDescHidden] = useState(true);
    const kindred = useRecoilState(kindredState);
    const [_drawer, openDrawer] = useRecoilState(drawerState);

    const artworkUrl = supabase.storage.from('v5').getPublicUrl(props.sect.artwork).data.publicUrl

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
                    {props.sect.artwork && (
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
                {props.sect.description && (
                    <Box>
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
                                <Text dangerouslySetInnerHTML={{ __html: props.sect.description }} size="sm" />
                            </TypographyStylesProvider>
                        </Blockquote>
                    </Box>
                )}
            </Box>
        </>
    )
}

