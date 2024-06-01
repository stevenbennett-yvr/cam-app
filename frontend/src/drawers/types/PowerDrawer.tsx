import { drawerState } from "@atoms/navAtoms";
import { fetchContentById } from "@content/content-store";
import { useQuery } from "@tanstack/react-query";
import { Discipline, Power } from "@typing/content";
import { useRecoilState, useRecoilValue } from "recoil";
import { Stack, Anchor, Box, Group, Title, Button, useMantineTheme, Text, Loader, Blockquote, TypographyStylesProvider, Divider, Avatar } from "@mantine/core";
import generateDots from "@utils/dots";
import { kindredState } from "@atoms/kindredAtoms";
import { useState } from "react";
import { IconInfoCircle } from "@tabler/icons-react";
import createChallengePool from "@utils/challenge-pool";
import { supabase } from "../../main";

export function PowerDrawerTitle(props: { data: { id?: number; power?: Power; onSelect?: () => void } }) {
    const id = props.data.id;

    const [_drawer, openDrawer] = useRecoilState(drawerState);

    const { data: _power } = useQuery({
        queryKey: [`find-feat-${id}`, { id }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            // eslint-disable-next-line
            const [_key, { id }] = queryKey;
            return await fetchContentById<Power>('power', id);
        },
        enabled: !!id,
    });
    const power = props.data.power ?? _power;

    return (
        <>
            {power && (
                <Group justify="space-between" wrap="nowrap">
                    <Group wrap="nowrap" gap={10}>
                        <Box>
                            <Title order={3}>{generateDots(power.level)} {power.name}</Title>
                        </Box>
                    </Group>
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
                            Select power
                        </Button>
                    )}
                </Group>
            )}
        </>
    );
};

export function PowerDrawerContent(props: {
    data: { id?: number; power?: Power },
    onMetadataChange?: (openedDict?: Record<string, string>) => void;
}) {
    const id = props.data.id;
    const theme = useMantineTheme();
    const [descHidden, setDescHidden] = useState(true)
    const [_drawer, openDrawer] = useRecoilState(drawerState)

    const kindred = useRecoilValue(kindredState)

    const { data } = useQuery({
        queryKey: [`find-power-details-${id}`, { id }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            // eslint-disable-next-line
            const [_key, { id }] = queryKey;
            const power = await fetchContentById<Power>('power', id);
            let amalgam = undefined
            if (power?.amalgam) {
                amalgam = await fetchContentById<Discipline>('discipline', power?.amalgam?.discipline)
            }
            let prerequisite = undefined
            if (power?.prerequisite_id) {
                prerequisite = await fetchContentById<Power>('power', power.prerequisite_id)
            }
            return {
                power: props.data.power ?? power,
                amalgam,
                prerequisite
            }
        },
        enabled: !!id,
    });

    if (!data || !data.power) {
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

    return (
        <Stack>
            {data?.power.summary && (
                <Box py={5}>
                    <Text size="xs">{data?.power.summary}</Text>
                </Box>
            )}
            {data?.amalgam && (
                <Box py={5}>
                    <Divider
                        px={'xs'}
                        label={
                            <Text fz={'xs'} c={'gray.6'}>
                                <Group>
                                    <Box>Amalgam</Box>
                                </Group>
                            </Text>
                        }
                        labelPosition="left"
                    />
                    <Box style={{ display: 'flex' }}>
                        <Avatar
                            size={'sm'}
                            src={
                                supabase.storage.from('v5').getPublicUrl(data?.amalgam.rombo).data.publicUrl
                            }
                        />
                        <Anchor
                            onClick={() => {
                                openDrawer({
                                    type: 'discipline',
                                    data: { id: data.power?.amalgam?.discipline },
                                    extra: { addToHistory: true }
                                })
                            }}
                        >
                            {data?.amalgam.name} {data.power.amalgam?.level}
                        </Anchor>
                    </Box>
                </Box>
            )}
            {data?.prerequisite && (
                <Box py={5}>
                    <Divider
                        px={'xs'}
                        label={
                            <Text fz={'xs'} c={'gray.6'}>
                                <Group>
                                    <Box>Amalgam</Box>
                                </Group>
                            </Text>
                        }
                        labelPosition="left"
                    />
                    <Box style={{ display: 'flex' }}>

                        <Anchor
                            onClick={() => {
                                openDrawer({
                                    type: 'power',
                                    data: { id: data?.prerequisite?.id },
                                    extra: { addToHistory: true }
                                })
                            }}
                        >
                            {data?.prerequisite.name}
                        </Anchor>
                    </Box>
                </Box>
            )}
            {data.power.ingredients && (
                <>
                    {data.power.ingredients.map((ingredients, index) => (
                        <Box py={5} key={index}>
                            <Divider
                                px={'xs'}
                                label={
                                    <Text fz={'xs'} c={'gray.6'}>
                                        <Group>
                                            <Box>{ingredients.label}</Box>
                                        </Group>
                                    </Text>
                                }
                                labelPosition="left"
                            />
                            <TypographyStylesProvider>
                                <Text dangerouslySetInnerHTML={{ __html: ingredients.text }} size="sm" />
                            </TypographyStylesProvider>
                        </Box>
                    ))}
                </>
            )}
            {data.power.process && (
                <Box py={5}>
                    <Divider
                        px={'xs'}
                        label={
                            <Text fz={'xs'} c={'gray.6'}>
                                <Group>
                                    <Box>Process</Box>
                                </Group>
                            </Text>
                        }
                        labelPosition="left"
                    />
                    <TypographyStylesProvider>
                        <Text dangerouslySetInnerHTML={{ __html: data.power.process }} size="sm" />
                    </TypographyStylesProvider>
                </Box>
            )}

            {data.power.challenge_pool && (
                <Box py={5}>
                    <Divider
                        px={'xs'}
                        label={
                            <Text fz={'xs'} c={'gray.6'}>
                                <Group>
                                    <Box>Challenge Pool</Box>
                                </Group>
                            </Text>
                        }
                        labelPosition="left"
                    />
                    <Text size="sm">{createChallengePool(data.power.challenge_pool)}</Text>
                </Box>
            )}
            {data.power.cost && (
                <Box py={5}>
                    <Divider
                        px={'xs'}
                        label={
                            <Text fz={'xs'} c={'gray.6'}>
                                <Group>
                                    <Box>Cost</Box>
                                </Group>
                            </Text>
                        }
                        labelPosition="left"
                    />
                    <Text size="sm">{data.power.cost}</Text>
                </Box>
            )}

            <Box
                style={{
                    position: 'relative',
                    maxWidth: 420
                }}
            >
                <Divider
                    px={'sm'}
                    label={
                        <Text fz={'xs'} c={'gray.6'}>
                            <Group>
                                <Box>System</Box>
                            </Group>
                        </Text>
                    }
                    labelPosition="left"
                />
                <Box
                    mah={descHidden ? 400 : undefined}
                    style={{
                        WebkitMaskImage: descHidden ? 'linear-gradient(to bottom, black 60%, transparent 100%)' : undefined,
                        maskImage: descHidden ? 'linear-gradient(to bottom, black 60%, transparent 100%)' : undefined,
                        overflowY: descHidden ? 'hidden' : undefined,
                    }}
                >
                    <Blockquote color="red" icon={<IconInfoCircle />} iconSize={40} ml={5} my={10}>
                        <TypographyStylesProvider>
                            <Text dangerouslySetInnerHTML={{ __html: data.power.description }} size="sm" />
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
            {data.power.duration && (
                <Box py={5}>
                    <Divider
                        px={'xs'}
                        label={
                            <Text fz={'xs'} c={'gray.6'}>
                                <Group>
                                    <Box>Duration</Box>
                                </Group>
                            </Text>
                        }
                        labelPosition="left"
                    />
                    <Text size="sm">{data.power.duration}</Text>
                </Box>
            )}
        </Stack>
    )
};