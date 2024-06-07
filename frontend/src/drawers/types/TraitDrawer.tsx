import { drawerState } from "@atoms/navAtoms";
import { Group, Box, Title, Accordion, Text, TypographyStylesProvider } from "@mantine/core";
import { IconBlockquote } from "@tabler/icons-react";

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

export function TraitDrawerContent(props: { 
    data: { variableName: string; };
    onMetadataChange?: (openedDict?: Record<string, string>) => void;
}) {
    
    return (
        <Box>
            <Accordion>
                <Accordion.Item value="description">
                    <Accordion.Control icon={<IconBlockquote size={'1rem'} />}>
                        Description
                    </Accordion.Control>
                    <Accordion.Panel>
                        <TypographyStylesProvider>
                            <div
                                dangerouslySetInnerHTML={{ __html: getTraitDescription(props.data.variableName)}}
                            />
                        </TypographyStylesProvider>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </Box>
    )
}

function getTraitDescription(traitName: string) {
    if (traitName==='Strength') {
        return `
        <p>How much you can lift, how far you can jump, how much force you can bring to bear... These matters of physical power are measured by Strength. The rough amount you can deadlift without an Attribute test appears in parentheses below. Characters who frequently use Brawl, Melee, Potence, and Protean will find Strength useful.</p>

        <ul>
            <li>• You can easily lift a child. (20 kg/44 lbs)</li>
            <li>•• You are physically average. (45 kg/99 lbs)</li>
            <li>••• You can lift a large person or similar-sized objects without difficulty. (115 kg/253 lbs)</li>
            <li>•••• You are remarkably strong, able to move things solo that would usually require a team. (180 kg/396 lbs)</li>
            <li>••••• Your strength is incredible, like the greatest of mortal body builders. (250 kg/550 lbs)</li>
        </ul>
        `
    }
    return '_No description available._'
}

