import { useMantineTheme, Accordion, Badge, Text, Group, Box, Button } from "@mantine/core";
import { useHover, useMergedRef } from "@mantine/hooks";
import { useRecoilState } from "recoil";
import { useRef } from "react";

import { selectContent } from "@common/select/SelectContent";

import { ICON_BG_COLOR_HOVER } from "@constants/data";

import { kindredState } from "@atoms/kindredAtoms";
import { drawerState } from "@atoms/navAtoms";
import * as _ from 'lodash-es'
import { Background, Loresheet } from "@typing/content";
import { Operation } from "@typing/operations";

export default function BackgroundSection(props: {}) {
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
                            /7
                        </Text>
                    </Badge>
                </Group>
            </Accordion.Control>
            <Accordion.Panel>
                <Box>
                    <Group wrap="nowrap" gap={10}>
                        <Button
                            size='compact-xs'
                            //leftSection={<IconLink size='0.9rem' />}
                            onClick={() => {
                                selectContent<Background>(
                                    'background',
                                    (option) => {}
                                )
                            }}
                            fw={400}
                        >
                            Select Background
                        </Button>
                        <Button
                            size='compact-xs'
                            //leftSection={<IconLink size='0.9rem' />}
                            onClick={() => {
                                selectContent<Loresheet>(
                                    'loresheet',
                                    (option) => { },
                                    {
                                        filterOptions: {
                                            options: [
                                                {
                                                    title: "Only prerequisites met",
                                                    type: "CHECKBOX",
                                                    key: 'prereq',
                                                    filterFn: (option) =>
                                                        option.clan_id === kindred?.details?.clanID || option.sect_id === kindred?.details?.sectID || (option.sect_id === null && option.clan_id === null)
                                                }
                                            ]
                                        },
                                    }
                                )
                            }}
                            fw={400}
                        >
                            Select Loresheet
                        </Button>
                    </Group>
                </Box>
                <Box>
                    <Group wrap="nowrap" justify="space-between" gap={0}>
                    </Group>
                </Box>
            </Accordion.Panel>
        </Accordion.Item>
    )
}