import { drawerState } from "@atoms/navAtoms";
import { Group, Box, Title } from "@mantine/core";

export function TraitDrawerTitle(props: { data: { variableName: string; }}) {

    return (
        <>
            {props.data.variableName && (
                <Group justify="space-between" wrap='nowrap'>
                    <Group wrap="nowrap" gap={10}>
                        <Box>
                            <Title order={3}>{props.data.variableName}</Title>
                        </Box>
                    </Group>
                    <Box>
                        Dots
                    </Box>
                </Group>
            )}
        </>
    )
}

export function TraitDrawerContent(props: { data: { variableName: string; }}) {
    


}