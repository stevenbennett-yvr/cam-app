import { kindredState } from "@atoms/kindredAtoms";
import { drawerState } from "@atoms/navAtoms";
import { fetchContentAll } from "@content/content-store";
import { Accordion, Box, Group, ScrollArea, Stack, TextInput, useMantineTheme, Text, Badge } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Discipline, Power } from "@typing/content";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import * as JsSearch from 'js-search';
import { IconSearch } from "@tabler/icons-react";
import { getAllDisciplines } from "@variables/variable-manager";
import { toLabel } from "@utils/to-label";
import useRefresh from "@utils/use-refresh";
import { StatButton } from "./CharacterStatSidebar";
import PowerSelectionOption from "@common/select/components/PowerSelectOption";
import { selectContent } from "@common/select/SelectContent";

export default function PowerPanel(props: { panelHeight: number; panelWidth: number }) {
    const theme = useMantineTheme();
    const kindred = useRecoilValue(kindredState);
    const [searchQuery, setSearchQuery] = useState('');
    const [_drawer, openDrawer] = useRecoilState(drawerState);

    const { data } = useQuery({
        queryKey: [`find-powers-and-disciplines`],
        queryFn: async () => {
            if (!kindred) return null;

            const powers = await fetchContentAll<Power>('power');
            const disciplines = await fetchContentAll<Discipline>('discipline');
            return {
                powers,
                disciplines,
            }
        }
    });
    const powers = data?.powers
    const disciplines = data?.disciplines

    // collectEntitySpellcasting

    const search = useRef(new JsSearch.Search('id'));
    useEffect(() => {
        if (!powers) return;
        search.current.addIndex('name');
        search.current.addIndex('description');
        search.current.addDocuments(powers);
    }, [powers]);

    const disciplinesVariables = getAllDisciplines("CHARACTER")

    return (
        <Box h='100%'>
            <Stack gap={10}>
                <Group>
                    <TextInput
                        style={{ flex: 1 }}
                        leftSection={<IconSearch size='0.9rem' />}
                        placeholder={`Search spells`}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        styles={{
                            input: {
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                borderColor: searchQuery.trim().length > 0 ? theme.colors['guide'][8] : undefined,
                            },
                        }}
                    />
                </Group>
                <ScrollArea scrollbars='y'>
                    <Accordion
                        variant="separated"
                        multiple
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
                                marginBottom: 10,
                            },
                        }}
                    >
                        {disciplinesVariables.map((disciplineVar, index) => {
                            let discipline = disciplines?.find((d) => d.name.toLocaleLowerCase() === toLabel(disciplineVar.name).toLocaleLowerCase()) as Discipline
                            return (
                            <>
                                {disciplineVar.value > 0 && (
                                    <div key={index}>
                                        <Accordion.Item value={disciplineVar.name}>
                                            <Accordion.Control>
                                                <Group wrap="nowrap" justify="space-between" gap={0}>
                                                    <Text c="gray.5" fw={700} fz="sm">
                                                        {toLabel(disciplineVar.name)}
                                                    </Text>
                                                    <Badge mr='sm' variant='outline' color='gray.5' size='xs'>
                                                        <Text fz='sm' c='gray.5' span>
                                                            {disciplineVar.value}
                                                        </Text>
                                                    </Badge>
                                                </Group>
                                            </Accordion.Control>
                                            <Accordion.Panel>
                                                <Stack gap={5}>
                                                    {disciplineVar.value > 0 &&
                                                        Array.from({ length: disciplineVar.value }, (_, index) => (
                                                            <PowerListEntry 
                                                            key={index}
                                                            rank={index+1}
                                                            discipline={discipline}
                                                            />
                                                        ))
                                                    }
                                                </Stack>
                                            </Accordion.Panel>
                                        </Accordion.Item>
                                    </div>
                                )}
                            </>
                        )})}
                    </Accordion>
                </ScrollArea>
            </Stack>
        </Box>
    )
}

function PowerListEntry(props: {
    power?: Power;
    rank: number;
    discipline: Discipline;
}) {
    const [_drawer, openDrawer] = useRecoilState(drawerState);
    if (props.power) {
        return (
            <StatButton
                onClick={() => {
                    if (!props.power) return;
                    openDrawer({
                        type: 'power',
                        data: {
                            id: props.power.id
                        },
                        extra: { addToHistory: true },
                    });
                    return;
                }}
            >
                <PowerSelectionOption
                    power={props.power}
                    noBackground
                    showButton={false}
                    px={0}

                />
            </StatButton>
        )
    } else {
        return (
            <StatButton
                onClick={() => {
                    selectContent<Power>(
                        'power',
                        (option) => { },
                        {
                            overrideLabel: `Select ${toLabel(props.discipline.name)} Power, Rank ${props.rank}`,
                            filterFn: (option) => option.discipline_id === props.discipline.id && option.level <= props.rank,
                        }
                    )
                }
                }
            >
                <Text fz='xs' fs='italic' c='dimmed' fw={500} pl={7}>
                    No Power Selected
                </Text>
            </StatButton>
        )
    }
}