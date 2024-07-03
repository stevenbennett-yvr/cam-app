import { useMantineTheme, Accordion, Anchor, Badge, Text, Group, Box, Divider, Select } from "@mantine/core";
import { useHover, useMergedRef, useFocusWithin } from "@mantine/hooks";
import { useRecoilState } from "recoil";
import { useRef } from "react";

import { toLabel } from "@utils/to-label";
import { ICON_BG_COLOR_HOVER } from "@constants/data";
import { getAllSkillVariables } from "@variables/variable-manager";

import { kindredState } from "@atoms/kindredAtoms";
import { drawerState } from "@atoms/navAtoms";
import * as _ from 'lodash-es'
import { VariableNum } from "@typing/variables";
import { OperationSetValue } from "@typing/operations";

export default function SkillSection(props: {}) {
    const theme = useMantineTheme();
    const { hovered, ref: hoverRef } = useHover();
    const { ref: focusRef, focused } = useFocusWithin();
    const [kindred, setKindred] = useRecoilState(kindredState);
    const choiceCountRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef(hoverRef, choiceCountRef, focusRef);
    const [_drawer, openDrawer] = useRecoilState(drawerState)

    const skills = getAllSkillVariables("CHARACTER");

    function hasAtLeastThreeValueThree(skills: VariableNum[]) {
        return skills.filter(skill => skill.value === 3).length >= 3;
    }

    function hasAtLeastFiveValueTwo(skills: VariableNum[]) {
        return skills.filter(skill => skill.value === 2).length >= 5;
    }

    function hasAtLeastSevenValueOne(skills: VariableNum[]) {
        return skills.filter(skill => skill.value === 1).length >= 7;
    }

    return (
        <Accordion.Item
            ref={mergedRef}
            value="skills"
            style={{
                backgroundColor: hovered || focused ? ICON_BG_COLOR_HOVER : undefined,
            }}
        >
            <Accordion.Control>
                <Group wrap='nowrap' justify="space-between" gap={0}>
                    <Text c={'gray.5'} fw={700} fz={'sm'}>
                        Skills
                    </Text>
                    <Group wrap='nowrap' justify="space-between" gap={0}>
                        <Badge mr='sm' variant='outline' color='gray.5' size='xs'>
                            <Text
                                fz='sm'
                                c={hasAtLeastSevenValueOne(skills) ? 'gray.5' : theme.colors[theme.primaryColor][5]}
                                fw={hasAtLeastSevenValueOne(skills) ? undefined : 600}
                                span
                            >
                                {skills.filter(skill => skill.value === 1).length}
                            </Text>
                            <Text fz='sm' c='gray.5' span>
                                /7 (1)
                            </Text>
                        </Badge>
                        <Badge mr='sm' variant='outline' color='gray.5' size='xs'>
                            <Text
                                fz='sm'
                                c={hasAtLeastFiveValueTwo(skills) ? 'gray.5' : theme.colors[theme.primaryColor][5]}
                                fw={hasAtLeastFiveValueTwo(skills) ? undefined : 600}
                                span
                            >
                                {skills.filter(skill => skill.value === 2).length}
                            </Text>
                            <Text fz='sm' c='gray.5' span>
                                /5 (2)
                            </Text>
                        </Badge>
                        <Badge mr='sm' variant='outline' color='gray.5' size='xs'>
                            <Text
                                fz='sm'
                                c={hasAtLeastThreeValueThree(skills) ? 'gray.5' : theme.colors[theme.primaryColor][5]}
                                fw={hasAtLeastThreeValueThree(skills) ? undefined : 600}
                                span
                            >
                                {skills.filter(skill => skill.value === 3).length}
                            </Text>
                            <Text fz='sm' c='gray.5' span>
                                /3 (3)
                            </Text>
                        </Badge>
                    </Group>
                </Group>
            </Accordion.Control>
            <Accordion.Panel>
                <Box>
                    <Group wrap="nowrap" justify="space-between" gap={0}>
                        {
                            [
                                { label: "Physical Traits", category: "PHYSICAL" },
                                { label: "Social Traits", category: "SOCIAL" },
                                { label: "Mental Traits", category: "MENTAL" }
                            ].map((category, index) => (
                                <Box key={index}>
                                    <Divider label={category.label} />
                                    {getAllSkillVariables("CHARACTER").map((skill, idx) => {
                                        if (!skill.name.includes(category.category)) {
                                            return null
                                        }
                                        return (
                                            <Select
                                                key={idx}
                                                size="xs"
                                                label={
                                                    <Anchor
                                                        key={idx}
                                                        onClick={() => {
                                                            openDrawer({
                                                                type: 'trait',
                                                                data: { variableName: toLabel(skill.name) }
                                                            })
                                                        }}
                                                    >
                                                        <Box>
                                                            <Text fz={'xs'}>
                                                                {toLabel(skill.name)} {skill.value}
                                                            </Text>
                                                        </Box>
                                                    </Anchor>
                                                }
                                                value={skill.value.toString()}
                                                allowDeselect={false}
                                                data={[
                                                    { value: "0", label: "0 - Untrained" },
                                                    { value: "1", label: "1 - Novice", disabled: hasAtLeastSevenValueOne(skills) },
                                                    { value: "2", label: "2 - Practiced", disabled: hasAtLeastFiveValueTwo(skills) },
                                                    { value: "3", label: "3 - Professional", disabled: hasAtLeastThreeValueThree(skills) },
                                                ]}
                                                onChange={(val) => {
                                                    if (val === null || val === undefined) {
                                                        return;
                                                    }

                                                    console.log(val)

                                                    setKindred((prev) => {
                                                        if (!prev) return prev;

                                                        // Find existing operation
                                                        let op = prev.operations.find(op => op.type === "setValue" && op.data.variable === skill.name) as OperationSetValue | undefined;
                                                    
                                                        let updatedOperations;
                                                    
                                                        if (op) {
                                                            // Create a new operation object if the value has changed
                                                            if (parseInt(val, 10) !== op.data.value) {
                                                                const updatedOp = { ...op, data: { ...op.data, value: parseInt(val, 10) } };
                                                                updatedOperations = prev.operations.map(o => o.id === op.id ? updatedOp : o);
                                                            } else {
                                                                updatedOperations = [...prev.operations];
                                                            }
                                                        } else {
                                                            // Create a new operation if it doesn't exist
                                                            const newOp = {
                                                                id: crypto.randomUUID(),
                                                                type: "setValue",
                                                                data: {
                                                                    variable: skill.name,
                                                                    value: _.toInteger(val)
                                                                },
                                                            } as OperationSetValue;
                                                            updatedOperations = [...prev.operations, newOp];
                                                        }
                                                    
                                                        return {
                                                            ...prev,
                                                            operations: updatedOperations
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