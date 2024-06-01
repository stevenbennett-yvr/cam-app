import { Button, Text, useMantineTheme, Group, Drawer, Title, Box, Stack, ScrollArea, Loader, Accordion, Divider, Badge, NumberInput } from "@mantine/core";
import { isCharacterBuilderMobile } from "../../utils/screen-sizes";
import { useEffect, useRef, useState } from "react";
import { CharacterInfo } from "../../common/CharacterInfo";
import { useElementSize, useHover, useInterval, useMergedRef } from "@mantine/hooks";
import { selectContent } from "../../common/select/SelectContent";
import { useRecoilState, useRecoilValue } from "recoil";
import { kindredState } from "../../atoms/kindredAtoms";
import { ClanType, SectType } from "../../typing/content";
import classes from '@css/FaqSimple.module.css'
import IndentedText from "@common/IndentedText";
import { IconId } from "@tabler/icons-react";
import { ICON_BG_COLOR_HOVER } from "@constants/data";

export default function KindredBuilderStepTwo(props: { pageHeight: number }) {
    const theme = useMantineTheme();
    const kindred = useRecoilValue(kindredState)
    const [doneLoading, setDoneLoading] = useState(false);

    // useQuery to get character

    return (
        <div style={{ display: undefined }}>
            <KindredBuilderStepTwoInner
                pageHeight={props.pageHeight}
            />
        </div>
    );
}

function KindredBuilderStepTwoInner(props: { pageHeight: number }) {
    const threme = useMantineTheme();
    const isMobile = isCharacterBuilderMobile();
    const [statPanelOpened, setStatPanelOpened] = useState(false);
    const [kindred, setKindred] = useRecoilState(kindredState)

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
                                    selectContent<SectType>(
                                        'sect',
                                        (option) => {
                                            setKindred((prev) => {
                                                if (!prev) return prev;
                                                return {
                                                    ...prev,
                                                    details: {
                                                        ...prev.details,
                                                        sect: option,
                                                    },
                                                }
                                            })
                                        }
                                    )
                                }}
                                onClickClan={() => {
                                    selectContent<ClanType>(
                                        'clan',
                                        (option) => {
                                            setKindred((prev) => {
                                                if (!prev) return prev;
                                                return {
                                                    ...prev,
                                                    details: {
                                                        ...prev.details,
                                                        sect: option,
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
                    </Accordion>
                </ScrollArea>
            </Box>
        </Group>
    )
}

function CharacterStatSideBar(props: { pageHeight: number }) {
    const { ref, height } = useElementSize();
    const [kindred, setKindred] = useRecoilState(kindredState)


    function StatButton(props: {
        children: React.ReactNode;
        onClick?: () => void;
        disabled?: boolean;
        darkVersion?: boolean;
    }) {
        const theme = useMantineTheme();
        const { hovered, ref } = useHover<HTMLButtonElement>();

        return (
            <Box>
                <Button
                    ref={ref}
                    disabled={props.disabled}
                    variant='default'
                    size='compact-lg'
                    styles={{
                        root: {
                            backgroundColor: props.darkVersion ? (hovered ? `#28292e` : `#212226`) : undefined,
                        },
                        inner: {
                            width: '100%',
                        },
                        label: {
                            width: '100%',
                        },
                    }}
                    fullWidth
                    onClick={props.onClick}
                >
                    <Group w='100%' justify='space-between' wrap='nowrap'>
                        {props.children}
                    </Group>
                </Button>
            </Box>
        );
    }


    return (
        <Stack gap={5}>
            <Box pb={5}>
                <CharacterInfo
                    kindred={kindred}
                    ref={ref}
                    onClickSect={() => {
                        selectContent<SectType>(
                            'sect',
                            (option) => {
                                setKindred((prev) => {
                                    if (!prev) return prev;
                                    return {
                                        ...prev,
                                        details: {
                                            ...prev.details,
                                            sect: option,
                                        },
                                    }
                                })
                            }
                        )
                    }}
                    onClickClan={() => {
                        selectContent<ClanType>(
                            'clan',
                            (option) => {
                                setKindred((prev) => {
                                    if (!prev) return prev;
                                    return {
                                        ...prev,
                                        details: {
                                            ...prev.details,
                                            sect: option,
                                        },
                                    }
                                })
                            }
                        )
                    }}
                    onClickPredatorType={() => { }}
                />
            </Box>
            <ScrollArea h={props.pageHeight - height - 20} pr={14} scrollbars='y'>
                <Stack gap={5}>
                    <StatButton>
                        <Box>
                            <Text c='gray.0' fz={'sm'}>Hit Points</Text>
                        </Box>
                        <Box>
                            <Text c='gray.0'>3</Text>
                        </Box>
                    </StatButton>
                    <StatButton>
                        <Box>
                            <Text c='gray.0' fz={'sm'}>Willpower</Text>
                        </Box>
                        <Box>
                            <Text c='gray.0'>2</Text>
                        </Box>
                    </StatButton>
                    <StatButton>
                        <Box>
                            <Text c='gray.0' fz={'sm'}>Initiative</Text>
                        </Box>
                        <Box>
                            <Text c='gray.0'>2</Text>
                        </Box>
                    </StatButton>
                    <Accordion
                        variant="separated"
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
                        <Accordion.Item className={classes.item} value="attributes">
                            <Accordion.Control>
                                <Text c='white' fz={'sm'}>
                                    Attributes
                                </Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Stack gap={5}>
                                    <StatButton>
                                        <Box>
                                            <Text>
                                                Attribute
                                            </Text>
                                        </Box>
                                        <Group wrap="nowrap">
                                            <Text>
                                                5
                                            </Text>
                                        </Group>
                                    </StatButton>
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item className={classes.item} value="skills">
                            <Accordion.Control>
                                <Text c='white' fz={'sm'}>
                                    Skills
                                </Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Stack gap={5}>
                                    <StatButton>
                                        <Box>
                                            <Text>
                                                Skill
                                            </Text>
                                        </Box>
                                        <Group wrap="nowrap">
                                            <Text>
                                                5
                                            </Text>
                                        </Group>
                                    </StatButton>
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item className={classes.item} value="disciplines">
                            <Accordion.Control>
                                <Text c='white' fz={'sm'}>
                                    Disciplines
                                </Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Stack gap={5}>
                                    <StatButton>
                                        <Box>
                                            <Text>
                                                Discipline
                                            </Text>
                                        </Box>
                                        <Group wrap="nowrap">
                                            <Text>
                                                5
                                            </Text>
                                        </Group>
                                    </StatButton>
                                    <Divider
                                        px='xs'
                                        label={
                                            <Text fz='xs' c='gray.6'>
                                                <Group gap={5}>
                                                    <Box>Powers</Box>
                                                </Group>
                                            </Text>
                                        }
                                        labelPosition='left'
                                    />
                                    <IndentedText>
                                        <StatButton>
                                            <Box>
                                                <Text fz={'sm'}>
                                                    Power
                                                </Text>
                                            </Box>
                                            <Group wrap="nowrap">
                                                <Text fz={'sm'}>
                                                    Lvl5
                                                </Text>
                                            </Group>
                                        </StatButton>
                                    </IndentedText>
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item className={classes.item} value="backgrounds">
                            <Accordion.Control>
                                <Text c='white' fz={'sm'}>
                                    Backgrounds
                                </Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Stack gap={5}>
                                    <StatButton>
                                        <Box>
                                            <Text>
                                                Background
                                            </Text>
                                        </Box>
                                        <Group wrap="nowrap">
                                            <Text>
                                                3
                                            </Text>
                                        </Group>
                                    </StatButton>
                                    <Divider
                                        px='xs'
                                        label={
                                            <Text fz='xs' c='gray.6'>
                                                <Group gap={5}>
                                                    <Box>Factors</Box>
                                                </Group>
                                            </Text>
                                        }
                                        labelPosition='left'
                                    />
                                    <IndentedText>
                                        <StatButton>
                                            <Box>
                                                <Text fz={'sm'}>
                                                    Power
                                                </Text>
                                            </Box>
                                            <Group wrap="nowrap">
                                                <Text fz={'sm'}>
                                                    Lvl5
                                                </Text>
                                                <Badge variant='default'>
                                                    A
                                                </Badge>
                                            </Group>
                                        </StatButton>
                                    </IndentedText>
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item className={classes.item} value="merits/flaws">
                            <Accordion.Control>
                                <Text c='white' fz={'sm'}>
                                    Merits & Flaws
                                </Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Stack gap={5}>
                                    <Divider
                                        px='xs'
                                        label={
                                            <Text fz='xs' c='gray.6'>
                                                <Group gap={5}>
                                                    <Box>Merits</Box>
                                                </Group>
                                            </Text>
                                        }
                                        labelPosition='left'
                                    />
                                    <StatButton>
                                        <Box>
                                            <Text>
                                                Merit
                                            </Text>
                                        </Box>
                                        <Group wrap="nowrap">
                                            <Text>
                                                3
                                            </Text>
                                        </Group>
                                    </StatButton>
                                    <Divider
                                        px='xs'
                                        label={
                                            <Text fz='xs' c='gray.6'>
                                                <Group gap={5}>
                                                    <Box>Flaws</Box>
                                                </Group>
                                            </Text>
                                        }
                                        labelPosition='left'
                                    />
                                    {/* Map out Flaws here */}

                                    <StatButton>
                                        <Box>
                                            <Text>
                                                Flaw
                                            </Text>
                                        </Box>
                                        <Group wrap="nowrap">
                                            <Text>
                                                3
                                            </Text>
                                        </Group>
                                    </StatButton>
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </Stack>
            </ScrollArea>
        </Stack>
    )
}

function AttributeSection(props: {
}) {
    const theme = useMantineTheme();
    const { hovered, ref } = useHover();
    const [kindred, setKindred] = useRecoilState(kindredState);
    const choiceCountRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef(ref, choiceCountRef);

    return (
        <Accordion.Item
            ref={mergedRef}
            value="attributes"
            style={{
                backgroundColor: hovered ? ICON_BG_COLOR_HOVER : undefined,
            }}
        >
            <Accordion.Control>
                <Group wrap='nowrap' justify="space-between" gap={0}>
                    <Text c={'gray.5'} fw={700} fz={'sm'}>
                        Attributes
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
                            /10
                        </Text>
                    </Badge>
                </Group>
            </Accordion.Control>
            <Accordion.Panel>
                <Box>
                    <Group wrap="nowrap" justify="space-between" gap={0}>
                        <Box>
                            <Stack gap={0}>
                                <Divider
                                    label="Physical Traits"
                                />
                                <NumberInput
                                    label="Strength"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                                <NumberInput
                                    label="Dexterity"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                                <NumberInput
                                    label="Stamina"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                            </Stack>
                        </Box>
                        <Box>
                            <Stack gap={0}>
                                <Divider
                                    label="Social Traits"
                                />
                                <NumberInput
                                    label="Charisma"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                                <NumberInput
                                    label="Manipulation"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                                <NumberInput
                                    label="Composure"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                            </Stack>
                        </Box>
                        <Box>
                            <Stack gap={0}>
                                <Divider
                                    label="Mental Traits"
                                />
                                <NumberInput
                                    label="Intelligence"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                                <NumberInput
                                    label="Wits"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                                <NumberInput
                                    label="Resolve"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                            </Stack>
                        </Box>
                    </Group>
                </Box>
            </Accordion.Panel>
        </Accordion.Item>
    )
}

function SkillSection(props: {
}) {
    const theme = useMantineTheme();
    const { hovered, ref } = useHover();
    const [kindred, setKindred] = useRecoilState(kindredState);
    const choiceCountRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef(ref, choiceCountRef);

    return (
        <Accordion.Item
            ref={mergedRef}
            value="skills"
            style={{
                backgroundColor: hovered ? ICON_BG_COLOR_HOVER : undefined,
            }}
        >
            <Accordion.Control>
                <Group wrap='nowrap' justify="space-between" gap={0}>
                    <Text c={'gray.5'} fw={700} fz={'sm'}>
                        Skills
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
                            /10
                        </Text>
                    </Badge>
                </Group>
            </Accordion.Control>
            <Accordion.Panel>
                <Box>
                    <Group wrap="nowrap" justify="space-between" gap={0}>
                        <Box>
                            <Stack gap={0}>
                                <Divider
                                    label="Physical Traits"
                                />
                                <NumberInput
                                    label="Athletics"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                                <NumberInput
                                    label="Brawl"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                                <NumberInput
                                    label="Craft"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                                <NumberInput
                                    label="Driving"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                                <NumberInput
                                    label="Marksmanship"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                                <NumberInput
                                    label="Larceny"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                                <NumberInput
                                    label="Melee"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                                <NumberInput
                                    label="Stealth"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                                <NumberInput
                                    label="Survival"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                            </Stack>
                        </Box>
                        <Box>
                            <Stack gap={0}>
                                <Divider
                                    label="Social Traits"
                                />
                                <NumberInput
                                    label="Charisma"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                                <NumberInput
                                    label="Manipulation"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                                <NumberInput
                                    label="Composure"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                            </Stack>
                        </Box>
                        <Box>
                            <Stack gap={0}>
                                <Divider
                                    label="Mental Traits"
                                />
                                <NumberInput
                                    label="Intelligence"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                                <NumberInput
                                    label="Wits"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                                <NumberInput
                                    label="Resolve"
                                    w={100}
                                    min={1}
                                    max={5}
                                />
                            </Stack>
                        </Box>
                    </Group>
                </Box>
            </Accordion.Panel>
        </Accordion.Item>
    )

}