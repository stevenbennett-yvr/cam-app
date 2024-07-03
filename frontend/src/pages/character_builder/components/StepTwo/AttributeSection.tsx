import { useMantineTheme, HoverCard, Accordion, Badge, Text, Group, Box, Divider, Select, Anchor } from "@mantine/core";
import { useHover, useMergedRef, useFocusWithin } from "@mantine/hooks";
import { useRecoilState } from "recoil";
import { useRef } from "react";

import { toLabel } from "@utils/to-label";
import { ICON_BG_COLOR_HOVER } from "@constants/data";

import { kindredState } from "@atoms/kindredAtoms";
import { drawerState } from "@atoms/navAtoms";
import * as _ from 'lodash-es'
import { getAllAttributeVariables } from "@variables/variable-manager";
import { VariableNum } from "@typing/variables";
import { OperationAdjValue, OperationSetValue } from "@typing/operations";

export default function AttributeSection(props: {
}) {
    const theme = useMantineTheme();
    const { hovered, ref: hoverRef } = useHover();
    const { ref: focusRef, focused } = useFocusWithin();
    const [kindred, setKindred] = useRecoilState(kindredState);
    const choiceCountRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef(hoverRef, choiceCountRef, focusRef);
    const [_drawer, openDrawer] = useRecoilState(drawerState)

    const attributes = getAllAttributeVariables("CHARACTER")

    function hasValueFour(attributes: VariableNum[]) {
        return attributes.some(attribute => attribute.value === 4);
    }

    function hasAtLeastThreeValueThree(attributes: VariableNum[]) {
        return attributes.filter(attribute => attribute.value === 3).length >= 3;
    }

    // Function to check if at least four options have value 2
    function hasAtLeastFourValueTwo(attributes: VariableNum[]) {
        return attributes.filter(attribute => attribute.value === 2).length >= 4;
    }

    return (
        <Accordion.Item
            ref={mergedRef}
            value="attributes"
            style={{
                backgroundColor: hovered || focused ? ICON_BG_COLOR_HOVER : undefined,
            }}
        >
            <Accordion.Control>
                <Group wrap='nowrap' justify="space-between" gap={0}>
                    <Text c={'gray.5'} fw={700} fz={'sm'}>
                        Attributes
                    </Text>
                    <HoverCard width={280}>
                        <HoverCard.Target>
                            <Group wrap='nowrap' justify="space-between" gap={0}>

                                <Badge mr='sm' variant='outline' color='gray.5' size='xs'>
                                    <Text
                                        fz='sm'
                                        c={hasAtLeastFourValueTwo(attributes) ? 'gray.5' : theme.colors[theme.primaryColor][5]}
                                        fw={hasAtLeastFourValueTwo(attributes) ? undefined : 600}
                                        span
                                    >
                                        {attributes.filter(attribute => attribute.value === 2).length}
                                    </Text>
                                    <Text fz='sm' c='gray.5' span>
                                        /4 (2)
                                    </Text>
                                </Badge>

                                <Badge mr='sm' variant='outline' color='gray.5' size='xs'>
                                    <Text
                                        fz='sm'
                                        c={hasAtLeastThreeValueThree(attributes) ? 'gray.5' : theme.colors[theme.primaryColor][5]}
                                        fw={hasAtLeastThreeValueThree(attributes) ? undefined : 600}
                                        span
                                    >
                                        {attributes.filter(attribute => attribute.value === 3).length}
                                    </Text>
                                    <Text fz='sm' c='gray.5' span>
                                        /3 (3)
                                    </Text>
                                </Badge>
                                <Badge mr='sm' variant='outline' color='gray.5' size='xs'>
                                    <Text
                                        fz='sm'
                                        c={hasValueFour(attributes) ? 'gray.5' : theme.colors[theme.primaryColor][5]}
                                        fw={hasValueFour(attributes) ? undefined : 600}
                                        span
                                    >
                                        {attributes.filter(attribute => attribute.value === 4).length}
                                    </Text>
                                    <Text fz='sm' c='gray.5' span>
                                        /1 (4)
                                    </Text>
                                </Badge>
                            </Group>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                            <Text fz="xs">
                                <ul>
                                    <li>Set one attribute to four dots.</li>
                                    <li>Set three attributes to three dots.</li>
                                    <li>Set four attributes to two dots.</li>
                                    <li>Leave one attribute at one dot.</li>
                                </ul>
                            </Text>
                        </HoverCard.Dropdown>
                    </HoverCard>
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
                                    {getAllAttributeVariables("CHARACTER").map((attribute, idx) => {
                                        if (!attribute.name.includes(category.category)) {
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
                                                                data: { variableName: toLabel(attribute.name) }
                                                            })
                                                        }}
                                                    >
                                                        <Box>
                                                            <Text fz={'xs'}>
                                                                {toLabel(attribute.name)} {attribute.value} 
                                                            </Text>
                                                        </Box>
                                                    </Anchor>
                                                }
                                                value={attribute.value.toString()}
                                                allowDeselect={false}
                                                data={[
                                                    { value: "1", label: "1 - Poor" },
                                                    { value: "2", label: "2 - Average", disabled: hasAtLeastFourValueTwo(attributes) },
                                                    { value: "3", label: "3 - Above Average", disabled: hasAtLeastThreeValueThree(attributes) },
                                                    { value: "4", label: "4 - Excellent", disabled: hasValueFour(attributes) },
                                                ]}
                                                onChange={(val) => {
                                                    if (val === null || val === undefined) {
                                                        return;
                                                    }

                                                    setKindred((prev) => {
                                                        if (!prev) return prev;

                                                        // Find existing operation
                                                        let op = prev.operations.find(op => op.type === "setValue" && op.data.variable === attribute.name) as OperationSetValue | undefined;
                                                    
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
                                                                    variable: attribute.name,
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