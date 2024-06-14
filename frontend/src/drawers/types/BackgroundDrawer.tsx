import { drawerState } from "@atoms/navAtoms";
import { fetchContent, fetchContentById } from "@content/content-store";
import { Accordion, Anchor, Badge, Blockquote, Box, Divider, Group, Loader, Stack, Text, Title, TypographyStylesProvider, useMantineTheme } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Background, BackgroundBenefit } from "@typing/content";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { getMetadataOpenedDict } from "@drawers/drawer-utils";
import BackgroundBenefitSelectionOption from "@common/select/components/BackgroundBenefitSelectOption";

export function BackgroundDrawerTitle(props: { data: { id?: number; background?: Background; onSelect?: () => void } }) {
    const id = props.data.id;

    const [_drawer, openDrawer] = useRecoilState(drawerState)

    const { data: _background } = useQuery({
        queryKey: [`find-background-${id}`, { id }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            const [_key, { id }] = queryKey;
            return await fetchContentById('background', id);
        },
        enabled: !!id,
    });
    const background = props.data.background ?? _background

    return (
        <>
            {background && (
                <Group justify="space-between" wrap="nowrap">
                    <Group wrap="nowrap" gap={10}>
                        <Box>
                            <Group>
                                <Title order={3}>{background.name}</Title>
                            </Group>
                        </Box>
                    </Group>
                </Group>
            )}
        </>
    )
}

export function BackgroundDrawerContent(props: {
    data: { id?: number; background?: Background; onSelect?: () => void }
    onMetadataChange?: (openedDict?: Record<string, string>) => void;
}) {
    const id = props.data.id;

    const [descHidden, setDescHidden] = useState(true)
    const [_drawer, openDrawer] = useRecoilState(drawerState)

    const { data } = useQuery({
        queryKey: [`find-background-details-${id}`, { id }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            const [_key, { id }] = queryKey;
            const background = await fetchContentById<Background>('background', id);
            const benefits = await fetchContent<BackgroundBenefit[]>('background_benefit', { background_id: id })
            return {
                background,
                benefits,
            }
        },
        enabled: !!id,
    });
    const background = props.data.background ?? data?.background
    const benefits = data?.benefits ?? []
    const advantages = benefits.filter(item => item.type === "advantage")
    const disadvantages = benefits.filter(item => item.type === "disadvantage")

    if (!data || !data.background || !data.benefits) {
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
            <BackgroundInitialOverview
                background={data.background}
            />
            {benefits.length > 0 && (
                <Accordion
                    variant='separated'
                    // Save opened state in drawer metadata (so it persists when opening links and going back)
                    defaultValue={getMetadataOpenedDict().background_benefit_section}
                    onChange={(value) => {
                        props.onMetadataChange?.({
                            feat_section: value ?? '',
                        });
                    }}
                >
                    {advantages.length > 0 && (
                        <Accordion.Item key={"advantage"} value={"advantage"}>
                            <Accordion.Control>
                                <Group wrap="nowrap" justify="space-between" gap={0}>
                                    <Text c={'gray.5'} fw={700} fz={'md'}>
                                        Advantages
                                    </Text>
                                    <Badge mr='sm' variant="outline" color="gray.5" size="xs">
                                        <Text fz='sm' c="gray.5" span>
                                            {advantages.length}
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

                                    {advantages
                                        .map((benefit, index) => (
                                            <BackgroundBenefitSelectionOption
                                                key={index}
                                                benefit={benefit}
                                                showButton={false}
                                                onClick={() => {
                                                    props.onMetadataChange?.();
                                                    openDrawer({
                                                        type: 'background_benefit',
                                                        data: { id: benefit.id },
                                                        extra: { addToHistory: true }
                                                    })
                                                }}
                                            />
                                        ))
                                    }
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>
                    )}

                    {disadvantages.length > 0 && (
                        <Accordion.Item key={"disadvantage"} value={"disadvantage"}>
                            <Accordion.Control>
                                <Group wrap="nowrap" justify="space-between" gap={0}>
                                    <Text c={'gray.5'} fw={700} fz={'md'}>
                                        Disadvantages
                                    </Text>
                                    <Badge mr='sm' variant="outline" color="gray.5" size="xs">
                                        <Text fz='sm' c="gray.5" span>
                                            {disadvantages.length}
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
                                    {disadvantages
                                        .map((benefit, index) => (
                                            <BackgroundBenefitSelectionOption
                                                key={index}
                                                benefit={benefit}
                                                showButton={false}
                                                onClick={() => {
                                                    props.onMetadataChange?.();
                                                    openDrawer({
                                                        type: 'background_benefit',
                                                        data: { id: benefit.id },
                                                        extra: { addToHistory: true }
                                                    })
                                                }}
                                            />
                                        ))
                                    }
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>
                    )}
                </Accordion>
            )}
        </Stack>
    )
}

function BackgroundInitialOverview(props: {
    background: Background;
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
                    <Blockquote color="red">
                        <TypographyStylesProvider>
                            <Text dangerouslySetInnerHTML={{ __html: props.background.description }} size="sm" />
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