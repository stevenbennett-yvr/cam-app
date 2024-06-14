import { drawerState } from "@atoms/navAtoms";
import { fetchContent, fetchContentById } from "@content/content-store";
import { Discipline, Power } from "@typing/content";
import { useRecoilState } from "recoil";
import { useQuery } from "@tanstack/react-query";
import { StyleProp, Anchor, Avatar, Divider, Blockquote, TypographyStylesProvider, Text, Group, Box, Title, Badge, Loader, Stack, useMantineTheme, Image, DefaultMantineColor, Accordion } from "@mantine/core";
import { useState } from "react";
import { supabase } from "../../main";
import * as _ from 'lodash-es';
import { getMetadataOpenedDict } from "@drawers/drawer-utils";
import PowerSelectionOption from "@common/select/components/PowerSelectOption";

export function DisciplineDrawerTitle(props: { data: { id?: number; discipline?: Discipline; onSelect?: () => void } }) {
    const id = props.data.id;

    const [_drawer, openDrawer] = useRecoilState(drawerState)

    const { data: _discipline } = useQuery({
        queryKey: [`find-discipline-${id}`, { id }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            const [_key, { id }] = queryKey;
            return await fetchContentById('discipline', id);
        },
        enabled: !!id,
    });
    const discipline = props.data.discipline ?? _discipline

    return (
        <>
            {discipline && (
                <Group justify="space-between" wrap="nowrap">
                    <Group wrap="nowrap" gap={10}>
                        <Box>
                            <Group>
                                <Avatar
                                    src={
                                        supabase.storage.from('v5').getPublicUrl(discipline.rombo).data.publicUrl
                                    }
                                    style={{
                                        marginRight: '10px'
                                    }}
                                />
                                <Title order={3}>{discipline.name}</Title>
                            </Group>
                        </Box>
                    </Group>
                </Group>
            )}
        </>
    )
}

export function DisciplineDrawerContent(props: {
    data: { id?: number; discipline?: Discipline; onSelect?: () => void }
    onMetadataChange?: (openedDict?: Record<string, string>) => void;
}) {
    const id = props.data.id;

    const [_drawer, openDrawer] = useRecoilState(drawerState)

    const { data } = useQuery({
        queryKey: [`find-discipline-details-${id}`, { id }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            // eslint-disable-next-line
            const [_key, { id }] = queryKey;
            const discipline = await fetchContentById<Discipline>('discipline', id);
            const powers = await fetchContent<Power[]>('power', { discipline_id: id })
            const auxDiscipline = await fetchContent<Discipline[]>('discipline', { prerequisite_id: id })
            return {
                discipline,
                powers,
                auxDiscipline
            };
        },
    });

    const powers = _.groupBy(data?.powers, 'level');
    const auxDiscipline = data?.auxDiscipline?.[0] ?? null;

    const getColor = (resonance: String): StyleProp<DefaultMantineColor> | undefined => {
        switch (resonance) {
            case "Sanguine": return "pink.6";
            case "Choleric": return "orange.6";
            case "Phlegmatic": return "blue.6";
            case "Melancholic": return "grape.6";
            case "Animal Blood": return "green.6";
            default: return undefined;
        }
    }

    if (!data || !data.discipline || !data.powers || !data.auxDiscipline) {
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
        )
    }

    const powersSections = Object.keys(powers).map((level) => (
        <Accordion.Item key={level} value={level}>
            <Accordion.Control>
                <Group wrap="nowrap" justify="space-between" gap={0}>
                    <Text c={'gray.5'} fw={700} fz={'md'}>
                        Level {level}
                    </Text>
                    <Badge mr='sm' variant="outline" color="gray.5" size="xs">
                        <Text fz='sm' c="gray.5" span>
                            {powers[level].length}
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
                    {powers[level]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((power, index) => (
                            <PowerSelectionOption
                                key={index}
                                power={power}
                                showButton={false}
                                onClick={() => {
                                    props.onMetadataChange?.();
                                    openDrawer({
                                        type: 'power',
                                        data: { id: power.id },
                                        extra: { addToHistory: true },
                                    })
                                }}
                            />
                        ))}
                </Stack>
            </Accordion.Panel>
        </Accordion.Item>
    ));

    return (
        <Stack>
            <DisciplineInitialOverview
                discipline={data.discipline}
                mode="READ"
            />
            <Box>
                {data.discipline.characteristics && (
                    <>
                        <Title order={3}>
                            Characteristics
                        </Title>
                        {data.discipline.characteristics.map((characteristic, index) => (
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
                {auxDiscipline && (
                    <Box py={5}>
                        <Divider
                            px={'xs'}
                            label={
                                <Text fz={'xs'} c={'gray.6'}>
                                    <Group>
                                        <Box>{auxDiscipline.name}</Box>
                                    </Group>
                                </Text>
                            }
                            labelPosition="left"
                        />
                        <Box style={{ display: 'flex' }}>
                            <Avatar
                                size={'sm'}
                                src={
                                    supabase.storage.from('v5').getPublicUrl(auxDiscipline.rombo).data.publicUrl
                                }
                            />
                            <Anchor
                                fz={'sm'}
                                onClick={() => {
                                    openDrawer({
                                        type: 'discipline',
                                        data: { id: auxDiscipline.id },
                                        extra: { addToHistory: true }
                                    })
                                }}
                            >
                                {auxDiscipline.name}
                            </Anchor>
                        </Box>
                    </Box>
                )}

                {data.discipline.masquerade_threat && (
                    <Box py={5}>
                        <Divider
                            px={'xs'}
                            label={
                                <Text fz={'xs'} c={'gray.6'}>
                                    <Group>
                                        <Box>Masquerade Threat</Box>
                                    </Group>
                                </Text>
                            }
                            labelPosition="left"
                        />
                        <TypographyStylesProvider>
                            <Text dangerouslySetInnerHTML={{ __html: data.discipline.masquerade_threat }} size="sm" />
                        </TypographyStylesProvider>
                    </Box>
                )}
                {data.discipline.resonance && (
                    <Box py={5}>
                        <Divider
                            px={'xs'}
                            label={
                                <Text fz={'xs'} c={'gray.6'}>
                                    <Group>
                                        <Box>Resonance</Box>
                                    </Group>
                                </Text>
                            }
                            labelPosition="left"
                        />
                        <TypographyStylesProvider>
                            <Text
                                dangerouslySetInnerHTML={{ __html: data.discipline.resonance }}
                                size="sm"
                                c={
                                    getColor(data.discipline.resonance)
                                }
                            />
                        </TypographyStylesProvider>
                    </Box>
                )}
                <Box>
                    <Title order={3}>Powers</Title>

                    <Accordion
                        variant='separated'
                        // Save opened state in drawer metadata (so it persists when opening links and going back)
                        defaultValue={getMetadataOpenedDict().power_section}
                        onChange={(value) => {
                            props.onMetadataChange?.({
                                feat_section: value ?? '',
                            });
                        }}
                    >
                        {powersSections}
                    </Accordion>
                </Box>
            </Box>
        </Stack>
    )
}

export function DisciplineInitialOverview(props: {
    discipline: Discipline;

    mode: 'READ' | 'READ/WRITE';
}) {
    const theme = useMantineTheme();
    const [descHidden, setDescHidden] = useState(true)
    const [_drawer, openDrawer] = useRecoilState(drawerState)

    return (
        <>
            <Box
                style={{
                    position: 'relative',
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
                    {props.discipline.artwork && (
                        <Image
                            style={{
                                float: 'right',
                                madWidth: 150,
                                height: 'auto',
                            }}
                            ml='sm'
                            radius='md'
                            fit='contain'
                            src={
                                supabase.storage.from('v5').getPublicUrl(props.discipline.artwork).data.publicUrl
                            }
                        />
                    )}
                    <Blockquote color="red">
                        <TypographyStylesProvider>
                            <Text dangerouslySetInnerHTML={{ __html: props.discipline.description }} size="sm" />
                        </TypographyStylesProvider>
                    </Blockquote>
                </Box>
                <Anchor
                    size='sm'
                    style={{
                        position: 'absolute',
                        bottom: 5,
                        right: 20,
                    }}
                    onClick={() => setDescHidden(!descHidden)}
                >
                    {descHidden ? 'Show more' : 'Show less'}
                </Anchor>
            </Box>
        </>
    )
}