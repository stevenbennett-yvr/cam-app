import { Button, Text, useMantineTheme, Group, Drawer, Title, Box, Stack, ScrollArea, Anchor, Accordion, Divider, Badge, NumberInput } from "@mantine/core";
import { isCharacterBuilderMobile } from "../../utils/screen-sizes";
import { useEffect, useRef, useState } from "react";
import { CharacterInfo } from "../../common/CharacterInfo";
import { useElementSize, useHover, useMergedRef } from "@mantine/hooks";
import { selectContent } from "../../common/select/SelectContent";
import { useRecoilState, useRecoilValue } from "recoil";
import { kindredState } from "../../atoms/kindredAtoms";
import { Background, Clan, Sect } from "../../typing/content";
import classes from '@css/FaqSimple.module.css'
import IndentedText from "@common/IndentedText";
import { IconId } from "@tabler/icons-react";
import { ICON_BG_COLOR_HOVER } from "@constants/data";
import { drawerState } from "@atoms/navAtoms";
import { getAllSkillTraits, getAttributesTraits } from "../../process/traits/trait-manager";
import { toLabel } from "@utils/to-label";
import { Category } from "@typing/traits";
import * as _ from 'lodash-es'
import { executeCharacterOperations } from "@operations/operation-controller";

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

    // Execute operations
    const executingOperations = useRef(false);
    useEffect(() => {
        if (!kindred || executingOperations.current) return;
        setTimeout(() => {
            if (!kindred || executingOperations.current) return;
            executingOperations.current = true;
            executeCharacterOperations(kindred).then(() => {
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
                    </Accordion>
                </ScrollArea>
            </Box>
        </Group>
    )
}

function CharacterStatSideBar(props: { pageHeight: number }) {
    const { ref, height } = useElementSize();
    const [kindred, setKindred] = useRecoilState(kindredState)
    const [_drawer, openDrawer] = useRecoilState(drawerState)




    return (
        <Stack gap={5}>
            <Box pb={5}>
                <CharacterInfo
                    kindred={kindred}
                    ref={ref}
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
                                    {getAttributesTraits("CHARACTER")
                                        .map((attribute, index) => (
                                            <>
                                                {index === 0 || getAttributesTraits("CHARACTER")[index - 1].category !== attribute.category ? (
                                                    <Divider
                                                        key={`divider-${index}`} // Adjust key according to your needs
                                                        px='xs'
                                                        label={
                                                            <Text fz='xs' c='gray.6'>
                                                                <Box>{toLabel(attribute.category)}</Box>
                                                            </Text>
                                                        }
                                                        labelPosition='left'
                                                    />
                                                ) : null}
                                                <StatButton
                                                    key={index}
                                                    onClick={() => {
                                                        openDrawer({
                                                            type: 'trait',
                                                            data: { variableName: attribute.name }
                                                        })
                                                    }}
                                                >
                                                    <Box>
                                                        <Text>
                                                            {toLabel(attribute.name)}
                                                        </Text>
                                                    </Box>
                                                    <Group wrap="nowrap">
                                                        <Text>
                                                            5
                                                        </Text>
                                                    </Group>
                                                </StatButton>
                                            </>
                                        ))
                                    }
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
                                    {getAllSkillTraits("CHARACTER")
                                        .map((skill, index) => (
                                            <>
                                                {index === 0 || getAllSkillTraits("CHARACTER")[index - 1].category !== skill.category ? (
                                                    <Divider
                                                        key={`divider-${index}`} // Adjust key according to your needs
                                                        px='xs'
                                                        label={
                                                            <Text fz='xs' c='gray.6'>
                                                                <Box>{toLabel(skill.category)}</Box>
                                                            </Text>
                                                        }
                                                        labelPosition='left'
                                                    />
                                                ) : null}
                                                <StatButton
                                                    key={index}
                                                    onClick={() => {
                                                        openDrawer({
                                                            type: 'trait',
                                                            data: { variableName: skill.name }
                                                        })
                                                    }}
                                                >
                                                    <Box>
                                                        <Text>
                                                            {toLabel(skill.name)}
                                                        </Text>
                                                    </Box>
                                                    <Group wrap="nowrap">
                                                        <Text>
                                                            5
                                                        </Text>
                                                    </Group>
                                                </StatButton>
                                            </>
                                        ))
                                    }
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
    const [_drawer, openDrawer] = useRecoilState(drawerState)

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
                        {
                            [
                                { label: "Physical Traits", category: "physical" as Category },
                                { label: "Social Traits", category: "social" as Category },
                                { label: "Mental Traits", category: "mental" as Category }
                            ].map((category, index) => (
                                <Box key={index}>
                                    <Divider label={category.label} />
                                    {getAttributesTraits("CHARACTER", category.category).map((attribute, idx) => {
                                        const op = kindred?.operations?.find(op => op.id.includes(attribute.name) && op.type === "setValue");
                                        return (
                                            <NumberInput
                                                key={idx}
                                                label={
                                                    <Anchor
                                                        key={index}
                                                        onClick={() => {
                                                            openDrawer({
                                                                type: 'trait',
                                                                data: { variableName: attribute.name }
                                                            })
                                                        }}
                                                    >
                                                        <Box>
                                                            <Text fz={'sm'}>
                                                                {toLabel(attribute.name)}
                                                            </Text>
                                                        </Box>
                                                    </Anchor>
                                                }
                                                w={100}
                                                min={1}
                                                max={4}
                                                defaultValue={op?.data.value}
                                                onChange={(val) => {
                                                    const newOp = _.cloneDeep(op);
                                                    if (!newOp) return;
                                                    newOp.data.value = val;

                                                    const operations = (kindred?.operations ?? []).map((p_op) => {
                                                        if (p_op.id === newOp.id) {
                                                            return newOp;
                                                        } else {
                                                            return p_op;
                                                        }
                                                    });

                                                    setKindred((prev) => {
                                                        if (!prev) return prev;
                                                        return {
                                                            ...prev,
                                                            operations
                                                        };
                                                    });


                                                }}
                                            />
                                        )
                                    })}
                                </Box>
                            ))
                        }
                    </Group>
                </Box>
            </Accordion.Panel>
        </Accordion.Item>
    )
}

function SkillSection(props: {}) {
    const theme = useMantineTheme();
    const { hovered, ref } = useHover();
    const [kindred, setKindred] = useRecoilState(kindredState);
    const choiceCountRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef(ref, choiceCountRef);
    const [_drawer, openDrawer] = useRecoilState(drawerState)

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
                        {
                            [
                                { label: "Physical Traits", category: "physical" as Category },
                                { label: "Social Traits", category: "social" as Category },
                                { label: "Mental Traits", category: "mental" as Category }
                            ].map((category, index) => (
                                <Box key={index}>
                                    <Divider label={category.label} />
                                    {getAllSkillTraits("CHARACTER", category.category).map((skill, idx) => {
                                        const op = kindred?.operations?.find(op => op.id.includes(skill.name.split(" ")[0]) && op.type === "setValue");
                                        return (
                                            <NumberInput
                                                key={idx}
                                                label={
                                                    <Anchor
                                                        key={index}
                                                        onClick={() => {
                                                            openDrawer({
                                                                type: 'trait',
                                                                data: { variableName: skill.name }
                                                            })
                                                        }}
                                                    >
                                                        <Box>
                                                            <Text fz={'sm'}>
                                                                {toLabel(skill.name)}
                                                            </Text>
                                                        </Box>
                                                    </Anchor>
                                                }
                                                w={100}
                                                min={0}
                                                max={4}
                                                defaultValue={op?.data.value}
                                                onChange={(val) => {
                                                    const newOp = _.cloneDeep(op);
                                                    if (!newOp) return;
                                                    newOp.data.value = val;

                                                    const operations = (kindred?.operations ?? []).map((p_op) => {
                                                        if (p_op.id === newOp.id) {
                                                            return newOp;
                                                        } else {
                                                            return p_op;
                                                        }
                                                    });

                                                    setKindred((prev) => {
                                                        if (!prev) return prev;
                                                        return {
                                                            ...prev,
                                                            operations
                                                        };
                                                    });
                                                }}
                                            />
                                        )
                                    })}
                                </Box>
                            ))
                        }
                    </Group>
                </Box>
            </Accordion.Panel>
        </Accordion.Item>
    )
}

function BackgroundSection(props: {}) {
    const theme = useMantineTheme();
    const { hovered, ref } = useHover();
    const [kindred, setKindred] = useRecoilState(kindredState);
    const choiceCountRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef(ref, choiceCountRef);
    const [_drawer, openDrawer] = useRecoilState(drawerState)

    return (
        <Accordion.Item
            ref={mergedRef}
            value="backgrounds"
            style={{
                backgroundColor: hovered ? ICON_BG_COLOR_HOVER : undefined,
            }}
        >
            <Accordion.Control>
                <Group wrap='nowrap' justify="space-between" gap={0}>
                    <Text c={'gray.5'} fw={700} fz={'sm'}>
                        Backgrounds
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
                    <Button
                        size='compact-xs'
                        //leftSection={<IconLink size='0.9rem' />}
                        onClick={() => {
                            selectContent<Background>(
                                'background',
                                (option) => {
                                    console.log(option)
                                }
                            )

                        }}
                        fw={400}
                    >
                        Select Background
                    </Button>
                </Box>
                <Box>
                    <Group wrap="nowrap" justify="space-between" gap={0}>
                    </Group>
                </Box>
            </Accordion.Panel>
        </Accordion.Item>
    )
}

function DisciplineSection(props: {}) {
    const theme = useMantineTheme();
    const { hovered, ref } = useHover();
    const [kindred, setKindred] = useRecoilState(kindredState);
    const choiceCountRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef(ref, choiceCountRef);
    const [_drawer, openDrawer] = useRecoilState(drawerState)

    return (
        <Accordion.Item
            ref={mergedRef}
            value="disciplines"
            style={{
                backgroundColor: hovered ? ICON_BG_COLOR_HOVER : undefined,
            }}
        >
            <Accordion.Control>
                <Group wrap='nowrap' justify="space-between" gap={0}>
                    <Text c={'gray.5'} fw={700} fz={'sm'}>
                        Disciplines
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
                        {
                            [
                                { label: "Physical Traits", category: "physical" as Category },
                                { label: "Social Traits", category: "social" as Category },
                                { label: "Mental Traits", category: "mental" as Category }
                            ].map((category, index) => (
                                <Box key={index}>
                                    <Divider label={category.label} />
                                    {getAllSkillTraits("CHARACTER", category.category).map((skill, idx) => {
                                        const op = kindred?.operations?.find(op => op.id.includes(skill.name.split(" ")[0]) && op.type === "setValue");
                                        return (
                                            <NumberInput
                                                key={idx}
                                                label={
                                                    <Anchor
                                                        key={index}
                                                        onClick={() => {
                                                            openDrawer({
                                                                type: 'trait',
                                                                data: { variableName: skill.name }
                                                            })
                                                        }}
                                                    >
                                                        <Box>
                                                            <Text fz={'sm'}>
                                                                {toLabel(skill.name)}
                                                            </Text>
                                                        </Box>
                                                    </Anchor>
                                                }
                                                w={100}
                                                min={skill.value}
                                                max={4}
                                                defaultValue={op?.data.value}
                                                onChange={(val) => {
                                                    const newOp = _.cloneDeep(op);
                                                    if (!newOp) return;
                                                    newOp.data.value = val;

                                                    const operations = (kindred?.operations ?? []).map((p_op) => {
                                                        if (p_op.id === newOp.id) {
                                                            return newOp;
                                                        } else {
                                                            return p_op;
                                                        }
                                                    });

                                                    setKindred((prev) => {
                                                        if (!prev) return prev;
                                                        return {
                                                            ...prev,
                                                            operations
                                                        };
                                                    });

                                                }}
                                            />
                                        )
                                    })}
                                </Box>
                            ))
                        }
                    </Group>
                </Box>
            </Accordion.Panel>
        </Accordion.Item>
    )
}


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