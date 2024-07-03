import { Select, Button, Text, Center, useMantineTheme, Group, Drawer, Title, Box, Stack, ScrollArea, Anchor, Accordion, Divider, Badge, NumberInput, Loader, Stepper, Checkbox, Rating } from "@mantine/core";
import { isCharacterBuilderMobile } from "../../utils/screen-sizes";
import { useEffect, useRef, useState } from "react";
import { CharacterInfo } from "../../common/CharacterInfo";
import { useHover, useMergedRef } from "@mantine/hooks";
import { selectContent } from "../../common/select/SelectContent";
import { useRecoilState, useRecoilValue } from "recoil";
import { kindredState } from "../../atoms/kindredAtoms";
import { Clan, Sect, MeritFlaw, ContentPackage, Discipline } from "../../typing/content";
import { IconCircle, IconCircleFilled, IconId } from "@tabler/icons-react";
import { ICON_BG_COLOR_HOVER, UGLY_RED } from "@constants/data";
import { drawerState } from "@atoms/navAtoms";
import * as _ from 'lodash-es'
import { executeCharacterOperations } from "@operations/operation-controller";
import { useQuery } from "@tanstack/react-query";
import { fetchContentPackage } from "@content/content-store";
import CharacterStatSideBar from "./components/StepTwo/CharacterStatSidebar";
import AttributeSection from "./components/StepTwo/AttributeSection";
import SkillSection from "./components/StepTwo/SkillSection";
import BackgroundSection from "./components/StepTwo/BackgroundSection";
import DisciplineSection from "./components/StepTwo/DisciplineSection";

export default function KindredBuilderStepTwo(props: { pageHeight: number }) {
    const theme = useMantineTheme();
    const kindred = useRecoilValue(kindredState)
    const [doneLoading, setDoneLoading] = useState(false);

    // useQuery to get character

    const { data: content, isFetching } = useQuery({
        queryKey: [`find-content-${kindred?.id}`],
        queryFn: async () => {
            const content = fetchContentPackage();
            return content;
        },
        refetchOnWindowFocus: false
    })

    if (!content) {
        return (
            <Center>
                <Group wrap='nowrap' gap={10}>
                    <Loader size='sm' />
                    <Title order={3}>Loading...</Title>
                </Group>
            </Center>
        )
    } else {
        return (
            <div style={{ display: undefined }}>
                <KindredBuilderStepTwoInner
                    content={content}
                    pageHeight={props.pageHeight}
                />
            </div>
        );
    }
}

function KindredBuilderStepTwoInner(props: {
    content: ContentPackage;
    pageHeight: number;
}) {
    const threme = useMantineTheme();
    const isMobile = isCharacterBuilderMobile();
    const [statPanelOpened, setStatPanelOpened] = useState(false);
    const [kindred, setKindred] = useRecoilState(kindredState)

    // Execute operations
    const executingOperations = useRef(false);
    useEffect(() => {
        if (!kindred || executingOperations.current) return;
        setTimeout(() => {
            if (!kindred || executingOperations.current) return;
            executingOperations.current = true;
            executeCharacterOperations(kindred, props.content, "CHARACTER-BUILDER").then(() => {
                executingOperations.current = false;
            })
        }, 1)
    }, [kindred])

    return (
        <Group gap={0}>
            {isMobile ? (
                <Drawer
                    opened={statPanelOpened}
                    onClose={() => {
                        setStatPanelOpened(false);
                    }}
                    title={<Title order={3}>Character Stats</Title>}
                    size='xs'
                    transitionProps={{ duration: 200 }}
                >
                    <CharacterStatSideBar pageHeight={props.pageHeight} />
                </Drawer>
            ) : (
                <Box style={{ flexBasis: '35%' }}>
                    <CharacterStatSideBar pageHeight={props.pageHeight} />
                </Box>
            )}
            <Box style={{ flexBasis: isMobile ? "100%" : "64%" }}>
                {isMobile && (
                    <>
                        <Group justify="space-between" align="flex-start" wrap="nowrap">
                            <CharacterInfo
                                kindred={kindred}
                                hideImage
                                onClickSect={() => {
                                    selectContent<Sect>(
                                        'sect',
                                        (option) => {
                                            setKindred((prev) => {
                                                if (!prev) return prev;
                                                return {
                                                    ...prev,
                                                    details: {
                                                        ...prev.details,
                                                        sectID: option.id,
                                                    },
                                                }
                                            })
                                        }
                                    )
                                }}
                                onClickClan={() => {
                                    selectContent<Clan>(
                                        'clan',
                                        (option) => {
                                            setKindred((prev) => {
                                                if (!prev) return prev;
                                                return {
                                                    ...prev,
                                                    details: {
                                                        ...prev.details,
                                                        clanID: option.id,
                                                    },
                                                }
                                            })
                                        }
                                    )
                                }}
                                onClickPredatorType={() => { }}
                            />
                            <Button
                                leftSection={<IconId size={14} />}
                                variant="outline"
                                size="xs"
                                mt={'sm'}
                                mr={'md'}
                                onClick={() => {
                                    setStatPanelOpened((prev) => !prev)
                                }}
                            >
                                Stats
                            </Button>
                        </Group>
                        <Divider pb={5} />
                    </>
                )}
                <ScrollArea h={props.pageHeight} pr={14} scrollbars='y'>
                    <Accordion
                        variant="filled"
                        styles={{
                            label: {
                                paddingTop: 5,
                                paddingBottom: 5,
                            },
                            control: {
                                paddingLeft: 13,
                                paddingRight: 13,
                            },
                            item: {
                                marginTop: 0,
                                marginBottom: 5,
                            },
                        }}
                    >
                        {<AttributeSection />}
                        {<SkillSection />}
                        {<BackgroundSection />}
                        {<MeritFlawSection />}
                        {<DisciplineSection content={props.content} />}
                    </Accordion>
                </ScrollArea>
            </Box>
        </Group>
    )
}


function MeritFlawSection(props: {}) {
    const theme = useMantineTheme();
    const { hovered, ref } = useHover();
    const [kindred, setKindred] = useRecoilState(kindredState);
    const choiceCountRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef(ref, choiceCountRef);
    const [_drawer, openDrawer] = useRecoilState(drawerState)

    return (
        <Accordion.Item
            ref={mergedRef}
            value="meritsflaws"
            style={{
                backgroundColor: hovered ? ICON_BG_COLOR_HOVER : undefined,
            }}
        >
            <Accordion.Control>
                <Group wrap='nowrap' justify="space-between" gap={0}>
                    <Text c={'gray.5'} fw={700} fz={'sm'}>
                        Merits and Flaws
                    </Text>
                    <Badge mr='sm' variant='outline' color='gray.5' size='xs'>
                        <Text
                            fz='sm'
                            //c={choiceCounts.current === choiceCounts.max ? 'gray.5' : theme.colors[theme.primaryColor][5]}
                            c={theme.colors[theme.primaryColor][5]}
                            //fw={choiceCounts.current === choiceCounts.max ? undefined : 600}
                            fw={600}
                            span
                        >
                            0
                        </Text>
                        <Text fz='sm' c='gray.5' span>
                            /0
                        </Text>
                    </Badge>
                </Group>
            </Accordion.Control>
            <Accordion.Panel>
                <Box>
                    <Stack>
                        <Group wrap="nowrap" gap={10}>
                            <Button
                                size='compact-xs'
                                //leftSection={<IconLink size='0.9rem' />}
                                onClick={() => {
                                    selectContent<MeritFlaw>(
                                        'merit_flaw',
                                        (option) => { },
                                        {
                                            overrideLabel: "Select Merit",
                                            filterFn: (option) => option.type === "merit",
                                            filterOptions: {
                                                options: [
                                                    {
                                                        title: "Categories",
                                                        type: "MULTI-SELECT",
                                                        options: [
                                                            { label: 'Bonding', value: 'bonding' },
                                                            { label: 'Connection', value: 'connection' },
                                                            { label: 'Feeding', value: 'feeding' },
                                                            { label: 'Mythical', value: 'mythical' },
                                                            { label: 'Physical', value: 'physical' },
                                                            { label: 'Psychological', value: 'psychological' },
                                                        ],
                                                        key: 'category'
                                                    }
                                                ]
                                            },
                                        }
                                    )
                                }}
                                fw={400}
                            >
                                Select Merit
                            </Button>
                            <Button
                                size='compact-xs'
                                //leftSection={<IconLink size='0.9rem' />}
                                onClick={() => {
                                    selectContent<MeritFlaw>(
                                        'merit_flaw',
                                        (option) => { },
                                        {
                                            overrideLabel: "Select Flaw",
                                            filterFn: (option) => option.type === "flaw",
                                            filterOptions: {
                                                options: [
                                                    {
                                                        title: "Categories",
                                                        type: "MULTI-SELECT",
                                                        options: [
                                                            { label: 'Bonding', value: 'bonding' },
                                                            { label: 'Connection', value: 'connection' },
                                                            { label: 'Feeding', value: 'feeding' },
                                                            { label: 'Mythical', value: 'mythical' },
                                                            { label: 'Physical', value: 'physical' },
                                                            { label: 'Psychological', value: 'psychological' },
                                                        ],
                                                        key: 'category'
                                                    }
                                                ]
                                            },
                                        }
                                    )
                                }}
                                fw={400}
                            >
                                Select Flaw
                            </Button>
                        </Group>
                    </Stack>
                </Box>
                <Box>
                    <Group wrap="nowrap" justify="space-between" gap={0}>
                    </Group>
                </Box>
            </Accordion.Panel>
        </Accordion.Item>
    )
}