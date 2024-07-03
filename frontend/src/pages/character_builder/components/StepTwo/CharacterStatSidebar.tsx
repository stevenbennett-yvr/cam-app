import { useElementSize, useHover } from "@mantine/hooks";
import { useRecoilState } from "recoil";
import { useMantineTheme, Button, Group, Divider, Accordion, Badge, Box, Stack, ScrollArea, Text } from "@mantine/core";

import { selectContent } from "@common/select/SelectContent";
import { CharacterInfo } from "@common/CharacterInfo";
import { getAllAttributeVariables } from "@variables/variable-manager";
import { getAllSkillVariables } from "@variables/variable-manager";
import classes from '@css/FaqSimple.module.css'
import { toLabel } from "@utils/to-label";
import IndentedText from "@common/IndentedText";

import { Sect, Clan } from "@typing/content";
import { kindredState } from "@atoms/kindredAtoms";
import { drawerState } from "@atoms/navAtoms";


export default function CharacterStatSideBar(props: { pageHeight: number }) {
    const { ref, height } = useElementSize();
    const [kindred, setKindred] = useRecoilState(kindredState);
    const [_drawer, openDrawer] = useRecoilState(drawerState);

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
                                        clanOperations: []
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
                    <StatButton key="hit-points">
                        <Box>
                            <Text c='gray.0' fz={'sm'}>Hit Points</Text>
                        </Box>
                        <Box>
                            <Text c='gray.0'>3</Text>
                        </Box>
                    </StatButton>
                    <StatButton key="willpower">
                        <Box>
                            <Text c='gray.0' fz={'sm'}>Willpower</Text>
                        </Box>
                        <Box>
                            <Text c='gray.0'>2</Text>
                        </Box>
                    </StatButton>
                    <StatButton key="initiative">
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
                        <Accordion.Item key="attributes" className={classes.item} value="attributes">
                            <Accordion.Control>
                                <Text c='white' fz={'sm'}>
                                    Attributes
                                </Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Stack gap={5}>
                                    {getAllAttributeVariables("CHARACTER")
                                        .map((attribute, index) => (
                                            <div key={`attribute-${index}`}>
                                                {index === 0 ? (
                                                    <Divider
                                                        key={`divider-${index}`}
                                                        px='xs'
                                                        label={
                                                            <Text fz='xs' c='gray.6'>
                                                                category
                                                            </Text>
                                                        }
                                                        labelPosition='left'
                                                    />
                                                ) : null}
                                                <StatButton
                                                    key={`stat-button-${index}`}
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
                                            </div>
                                        ))
                                    }
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item key="skills" className={classes.item} value="skills">
                            <Accordion.Control>
                                <Text c='white' fz={'sm'}>
                                    Skills
                                </Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Stack gap={5}>
                                    {getAllSkillVariables("CHARACTER")
                                        .map((skill, index) => (
                                            <div key={`skill-${index}`}>
                                                {index === 0 ? (
                                                    <Divider
                                                        key={`divider-${index}`}
                                                        px='xs'
                                                        label={
                                                            <Text fz='xs' c='gray.6'>
                                                                <Box></Box>
                                                            </Text>
                                                        }
                                                        labelPosition='left'
                                                    />
                                                ) : null}
                                                <StatButton
                                                    key={`stat-button-${index}`}
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
                                            </div>
                                        ))
                                    }
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item key="disciplines" className={classes.item} value="disciplines">
                            <Accordion.Control>
                                <Text c='white' fz={'sm'}>
                                    Disciplines
                                </Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Stack gap={5}>
                                    <StatButton key="discipline-1">
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
                                        key="divider-discipline"
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
                                        <StatButton key="power-1">
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
                        <Accordion.Item key="backgrounds" className={classes.item} value="backgrounds">
                            <Accordion.Control>
                                <Text c='white' fz={'sm'}>
                                    Backgrounds
                                </Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Stack gap={5}>
                                    <StatButton key="background-1">
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
                                        key="divider-background"
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
                                        <StatButton key="factor-1">
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
                        <Accordion.Item key="merits-flaws" className={classes.item} value="merits/flaws">
                            <Accordion.Control>
                                <Text c='white' fz={'sm'}>
                                    Merits & Flaws
                                </Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Stack gap={5}>
                                    <Divider
                                        key="divider-merits"
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
                                    <StatButton key="merit-1">
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
                                        key="divider-flaws"
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
                                    <StatButton key="flaw-1">
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
    );
}

export function StatButton(props: {
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