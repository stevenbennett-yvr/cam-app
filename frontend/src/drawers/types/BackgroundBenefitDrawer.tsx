import { fetchContentById } from "@content/content-store";
import { useQuery } from "@tanstack/react-query";
import { BackgroundBenefit } from "@typing/content";
import { Box, Group, Title, Text, Loader, Blockquote, TypographyStylesProvider } from "@mantine/core";
import generateDots from "@utils/dots";

export function BackgroundBenefitDrawerTitle(props: { data: { id?: number; benefit?: BackgroundBenefit; onSelect?: () => void } }) {
    const id = props.data.id;
    const { data: _benefit } = useQuery({
        queryKey: [`find-background-benefit-${id}`, { id }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            // eslint-disable-next-line
            const [_key, { id }] = queryKey;
            return await fetchContentById<BackgroundBenefit>('background_benefit', id);
        },
        enabled: !!id,
    });
    const benefit = props.data.benefit ?? _benefit;

    function levelsDisplay(levels: number[]) {
        if (levels.length > 1) {
            const dots1 = generateDots(levels[0]);
            const dots2 = generateDots(levels[levels.length-1]);
            return `(${dots1} to ${dots2})`;
        } else if (levels.length === 1) {
            const dots1 = generateDots(levels[0]);
            return `(${dots1})`;
        } else {
            return "";
        }
    }

    return (
        <>
            {benefit && (
                <Group justify="space-between" wrap="nowrap">
                    <Group wrap="nowrap" gap={10}>
                        <Box>
                            <Title order={3}>{benefit.name} {levelsDisplay(benefit.levels)}</Title>
                        </Box>
                    </Group>
                </Group>
            )}
        </>
    );
};

export function BackgroundBenefitDrawerContent(props: { 
    data: { id?: number; benefit?: BackgroundBenefit },
    onMetadataChange?: (openedDict?: Record<string, string>) => void;
}) {
    const id = props.data.id;
    const { data: _benefit } = useQuery({
        queryKey: [`find-feat-${id}`, { id }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            // eslint-disable-next-line
            const [_key, { id }] = queryKey;
            return await fetchContentById<BackgroundBenefit>('background_benefit', id);
        },
        enabled: !!id,
    });
    const benefit = props.data.benefit ?? _benefit;

    if (!benefit) {
        return (
            <Loader
                type='bars'
                style={{
                    position: 'absolute',
                    top: '35%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            />
        )
    }

    return (
        <Box>
            <Box>
                <Blockquote color="red">
                    <TypographyStylesProvider>
                        <Text dangerouslySetInnerHTML={{ __html: benefit.description }} size="sm" />
                    </TypographyStylesProvider>
                </Blockquote>
            </Box>
        </Box>
    )

}