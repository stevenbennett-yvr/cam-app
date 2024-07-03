import { fetchContentById } from "@content/content-store";
import { useQuery } from "@tanstack/react-query";
import { MeritFlaw } from "@typing/content";
import { Box, Group, Title, Text, Loader, Blockquote, TypographyStylesProvider } from "@mantine/core";
import { levelsDisplay } from "@utils/dots";

export function MeritFlawDrawerTitle(props: { data: { id?: number; meritFlaw?: MeritFlaw; onSelect?: () => void } }) {
    const id = props.data.id;
    const { data: _meritFlaw } = useQuery({
        queryKey: [`find-merit-flaw-${id}`, { id }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            // eslint-disable-next-line
            const [_key, { id }] = queryKey;
            return await fetchContentById<MeritFlaw>('merit_flaw', id);
        },
        enabled: !!id,
    });
    const meritFlaw = props.data.meritFlaw ?? _meritFlaw;

    return (
        <>
            {meritFlaw && (
                <Group justify="space-between" wrap="nowrap">
                    <Group wrap="nowrap" gap={10}>
                        <Box>
                            <Title order={3}>{meritFlaw.name} {levelsDisplay(meritFlaw.levels)}</Title>
                        </Box>
                    </Group>
                </Group>
            )}
        </>
    );
};

export function MeritFlawDrawerContent(props: { 
    data: { id?: number; meritFlaw?: MeritFlaw },
    onMetadataChange?: (openedDict?: Record<string, string>) => void;
}) {
    const id = props.data.id;
    const { data: _meritFlaw } = useQuery({
        queryKey: [`find-merit-flaw-details-${id}`, { id }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            // eslint-disable-next-line
            const [_key, { id }] = queryKey;
            return await fetchContentById<MeritFlaw>('merit_flaw', id);
        },
        enabled: !!id,
    });
    const meritFlaw = props.data.meritFlaw ?? _meritFlaw;

    if (!meritFlaw) {
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
                        <Text dangerouslySetInnerHTML={{ __html: meritFlaw.description }} size="sm" />
                    </TypographyStylesProvider>
                </Blockquote>
            </Box>
        </Box>
    )

}