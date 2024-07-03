import { Select, Button, Text, useMantineTheme, Group, Box, Stack, Anchor, Accordion, Divider, Badge, TextInput, ScrollArea, Modal, Title } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { useHover, useMergedRef } from "@mantine/hooks";
import { selectContent } from "@common/select/SelectContent";
import { useRecoilState } from "recoil";
import { kindredState } from "@atoms/kindredAtoms";
import { ContentPackage, Discipline, Power } from "@typing/content";
import { ICON_BG_COLOR_HOVER } from "@constants/data";
import { drawerState } from "@atoms/navAtoms";
import * as _ from 'lodash-es'
import { getAllDisciplineIds, getAllDisciplines } from "@variables/variable-manager";
import { toLabel } from "@utils/to-label";
import { OperationAdjValue, OperationCreateValue, OperationSetValue } from "@typing/operations";
import { VariableNum } from "@typing/variables";
import useRefresh from "@utils/use-refresh";
import PowerPanel from "./PowerSection";

export default function DisciplineSection(props: {
    content: ContentPackage
}) {
    const theme = useMantineTheme();
    const { hovered, ref } = useHover();
    const [kindred, setKindred] = useRecoilState(kindredState);
    const choiceCountRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef(ref, choiceCountRef);
    const [_drawer, openDrawer] = useRecoilState(drawerState)


    const disciplineVariables = getAllDisciplines("CHARACTER")
    const knownDisciplineIds = getAllDisciplineIds("CHARACTER")
    const notDisciplines = [12, 13, 14]
    const filter = [...knownDisciplineIds, ...notDisciplines];

    const inClanIds = _.map(props.content.clan_disciplines.filter(cd => cd.clan_id === kindred?.details?.clanID), 'discipline_id')
    const inClanDisciplines = _.filter(props.content.disciplines, discipline => _.includes(inClanIds, discipline.id))
    const outClanIds = knownDisciplineIds.filter((element) => !inClanIds.includes(element));
    const OutClanDisciplines = _.filter(props.content.disciplines, discipline => _.includes(outClanIds, discipline.id))


    function hasTwoValueInClan(disciplines: VariableNum[]) {
        return disciplines.some(discipline => discipline.value === 2 && discipline.name.includes("INCLAN"));
    }
    function hasOneValueInClan(disciplines: VariableNum[]) {
        return disciplines.some(discipline => discipline.value === 1 && discipline.name.includes("INCLAN"));
    }
    function hasOneValueOther(disciplines: VariableNum[]) {
        return disciplines.filter(discipline => discipline.value === 1).length > 1
    }

    const addDiscipline = (val: any, disciplineVariable: VariableNum) => {
        setKindred((prev) => {
            if (!prev) return prev;
            const intValue = _.toInteger(val);

            // Find existing operation
            let op = prev.clanOperations.find(op => op.type === "setValue" && op.data.variable === disciplineVariable?.name) as OperationSetValue | undefined;
            let updatedOperations;

            if (op) {
                // Create a new operation object if the value has changed
                if (intValue !== op.data.value) {
                    const updatedOp = { ...op, data: { ...op.data, value: intValue } };
                    updatedOperations = prev.clanOperations.map(o => o.id === op.id ? updatedOp : o);
                } else {
                    updatedOperations = [...prev.clanOperations];
                }
            } else {
                // Create a new operation if it doesn't exist
                const newOp = {
                    id: crypto.randomUUID(),
                    type: "setValue",
                    data: {
                        variable: disciplineVariable?.name,
                        value: intValue
                    },
                } as OperationSetValue;
                updatedOperations = [...prev.clanOperations, newOp];
            }
            return {
                ...prev,
                clanOperations: updatedOperations
            };
        });
    }

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
                    {inClanIds.length > 0 && (
                        <Group wrap='nowrap' justify="space-between" gap={0}>

                            <Badge mr='sm' variant='outline' color='gray.5' size='xs'>
                                <Text
                                    fz='sm'
                                    c={hasOneValueOther(disciplineVariables) ? 'gray.5' : theme.colors[theme.primaryColor][5]}
                                    fw={hasOneValueOther(disciplineVariables) ? undefined : 600}
                                    span
                                >
                                    {hasOneValueOther(disciplineVariables) ? 1 : 0}
                                </Text>
                                <Text fz='sm' c='gray.5' span>
                                    /1 (1)
                                </Text>
                            </Badge>
                            <Badge mr='sm' variant='outline' color='gray.5' size='xs'>
                                <Text
                                    fz='sm'
                                    c={hasOneValueInClan(disciplineVariables) ? 'gray.5' : theme.colors[theme.primaryColor][5]}
                                    fw={hasOneValueInClan(disciplineVariables) ? undefined : 600}
                                    span
                                >
                                    {hasOneValueInClan(disciplineVariables) ? 1 : 0}
                                </Text>
                                <Text fz='sm' c='gray.5' span>
                                    /1 (1)
                                </Text>
                            </Badge>
                            <Badge mr='sm' variant='outline' color='gray.5' size='xs'>
                                <Text
                                    fz='sm'
                                    c={hasTwoValueInClan(disciplineVariables) ? 'gray.5' : theme.colors[theme.primaryColor][5]}
                                    fw={hasTwoValueInClan(disciplineVariables) ? undefined : 600}
                                    span
                                >
                                    {disciplineVariables.filter(discipline => discipline.value === 2).length}
                                </Text>
                                <Text fz='sm' c='gray.5' span>
                                    /1 (2)
                                </Text>
                            </Badge>
                        </Group>
                    )}
                </Group>
            </Accordion.Control>
            <Accordion.Panel>
                <Box>
                    <Stack>
                        {inClanDisciplines.length > 0 && (
                            <Box>
                                <Divider label={"In Clan Disciplines"} />
                                <Group wrap="nowrap" justify="space-between" gap={0}>
                                    {inClanDisciplines.map((discipline, id) => {
                                        const disciplineVariable = disciplineVariables.find(dv => dv.name.includes(discipline.name.toLocaleUpperCase()))
                                        return (
                                            <Select
                                                key={id}
                                                size="xs"
                                                label={
                                                    <Anchor
                                                        key={id}
                                                        onClick={() => {
                                                            openDrawer({
                                                                type: 'discipline',
                                                                data: { id: discipline.id }
                                                            })
                                                        }}
                                                    >
                                                        <Box>
                                                            <Text fz={'xs'}>
                                                                {toLabel(discipline.name)} {disciplineVariable?.value}
                                                            </Text>
                                                        </Box>
                                                    </Anchor>
                                                }
                                                value={disciplineVariable?.value ? _.toString(disciplineVariable?.value) : "0"}
                                                allowDeselect={false}
                                                data={[
                                                    { value: "0", label: "0 - Untrained" },
                                                    { value: "1", label: "1 - Novice", disabled: hasOneValueInClan(disciplineVariables) && hasOneValueOther(disciplineVariables) },
                                                    { value: "2", label: "2 - Practiced", disabled: hasTwoValueInClan(disciplineVariables) },
                                                ]}
                                                onChange={(val) => {
                                                    if (val === null || val === undefined || disciplineVariable === undefined) {
                                                        return;
                                                    }

                                                    addDiscipline(val, disciplineVariable)
                                                }}
                                            />
                                        )
                                    })}
                                </Group>
                            </Box>
                        )}
                        <Box>
                            <Divider label={"Out of Clan Disciplines"} />
                            <Group wrap="nowrap" gap={10}>
                                <Button
                                    size="compact-xs"
                                    onClick={() => {
                                        selectContent<Discipline>(
                                            'discipline',
                                            (option) => {
                                                setKindred((prev) => {
                                                    if (!prev) return prev;
                                                    const newOps = [{
                                                        id: crypto.randomUUID(),
                                                        type: "createValue",
                                                        data: {
                                                            variable: `DISCIPLINE_${option.name.toUpperCase()}`,
                                                            type: "num",
                                                            value: 1
                                                        },
                                                    } as OperationCreateValue,
                                                    {
                                                        id: crypto.randomUUID(),
                                                        type: "adjValue",
                                                        data: {
                                                            variable: "DISCIPLINE_IDS",
                                                            value: `${option.id}`
                                                        }
                                                    } as OperationAdjValue
                                                    ]
                                                    return {
                                                        ...prev,
                                                        clanOperations: [...prev.clanOperations].concat(newOps)
                                                    }
                                                })
                                            },
                                            {
                                                overrideLabel: "Select Out of Clan Discipline",
                                                filterFn: (option) =>
                                                    !filter.includes(option.id)
                                            }
                                        )
                                    }
                                    }
                                    disabled={!kindred?.details?.clanID || !hasOneValueInClan(disciplineVariables) || !hasTwoValueInClan(disciplineVariables) || hasOneValueOther(disciplineVariables)}
                                >
                                    Add Out of Clan
                                </Button>
                            </Group>
                            <Stack>
                                {OutClanDisciplines.length > 0 && (
                                    <Box>
                                        <Group wrap="nowrap" justify="space-between" gap={0}>
                                            {OutClanDisciplines.map((discipline, id) => {
                                                const disciplineVariable = disciplineVariables.find(dv => dv.name.includes(discipline.name.toLocaleUpperCase()))
                                                return (
                                                    <Select
                                                        key={id}
                                                        size="xs"
                                                        label={
                                                            <Anchor
                                                                key={id}
                                                                onClick={() => {
                                                                    openDrawer({
                                                                        type: 'discipline',
                                                                        data: { id: discipline.id }
                                                                    })
                                                                }}
                                                            >
                                                                <Box>
                                                                    <Text fz={'xs'}>
                                                                        {toLabel(discipline.name)} {disciplineVariable?.value}
                                                                    </Text>
                                                                </Box>
                                                            </Anchor>
                                                        }
                                                        value={_.toString(disciplineVariable?.value)}
                                                        allowDeselect={false}
                                                        data={[
                                                            { value: "0", label: "0 - Untrained" },
                                                            { value: "1", label: "1 - Novice" },
                                                        ]}
                                                        onChange={(val) => {
                                                            if (val === null || val === undefined || disciplineVariable === undefined) {
                                                                return;
                                                            }

                                                            addDiscipline(val, disciplineVariable)

                                                        }}
                                                    />
                                                )
                                            })}
                                        </Group>
                                    </Box>
                                )}
                            </Stack>
                        </Box>
                        <Divider label={"Powers"} />
                        <PowerPanel
                            panelHeight={300}
                            panelWidth={300}
                        >
                        </PowerPanel>
                    </Stack>
                </Box>
            </Accordion.Panel>
        </Accordion.Item>
    )
}