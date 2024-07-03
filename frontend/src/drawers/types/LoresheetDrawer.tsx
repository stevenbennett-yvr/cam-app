import { kindredState } from "@atoms/kindredAtoms";
import { drawerState } from "@atoms/navAtoms";
import { fetchContent, fetchContentById } from "@content/content-store";
import { Anchor, Text, Group, Image, Loader, Blockquote, TypographyStylesProvider, Title, Box, Button, Stack, useMantineTheme, Divider } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Loresheet, LoresheetBenefit } from "@typing/content";
import { useRecoilState } from "recoil";
import { supabase } from "../../main";
import { generateDots } from "@utils/dots";

export function LoresheetDrawerTitle(props: { data: { id?: number; loresheet?: Loresheet; onSelect?: () => void } }) {
    const id = props.data.id;

    const [_drawer, openDrawer] = useRecoilState(drawerState);

    const { data: _loresheet } = useQuery({
        queryKey: [`find-loresheet-${id}`, { id }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            // eslint-disable-next-line
            const [_key, { id }] = queryKey;
            return await fetchContentById<Loresheet>('loresheet', id);
        },
        enabled: !!id,
    })
    const loresheet = props.data.loresheet ?? _loresheet;
    const [kindred,] = useRecoilState(kindredState);


    if (!_loresheet) {
        return (
            <Loader
                type="bars"
                style={{
                    position: 'absolute',
                    top: '35%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            />
        )
    };

    const showButton = _loresheet.clan_id === kindred?.details?.clanID || _loresheet.sect_id === kindred?.details?.sectID || (_loresheet.sect_id === null && _loresheet.clan_id === null)


    return (
        <>
            {loresheet && (
                <Group justify='space-between' wrap='nowrap'>
                    <Group wrap="nowrap" gap={10}>
                        <Box>
                            <Title order={3}>
                                {loresheet.name}
                            </Title>
                        </Box>
                        {props.data.onSelect && (
                            <Button
                                variant="filled"
                                radius={"xl"}
                                mb={5}
                                size="compact-sm"
                                disabled={!showButton}
                                onClick={() => {
                                    props.data.onSelect?.();
                                    openDrawer(null);
                                }}
                            >
                                Select Loresheet
                            </Button>
                        )}
                    </Group>
                </Group>
            )}
        </>
    )
}

export function LoresheetDrawerContent(props: {
    data: { id?: number; loresheet?: Loresheet; },
    onMetadataChange?: (openedDict?: Record<string, string>) => void;
}) {
    const id = props.data.id;

    const { data } = useQuery({
        queryKey: [`find-loresheet-details-${id}`, { id }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            // eslint-disable-next-line
            const [_key, { id }] = queryKey;
            const loresheet = await fetchContentById<Loresheet>('loresheet', id);
            const benefits = await fetchContent<LoresheetBenefit[]>('loresheet_benefit', {loresheet_id:id})
            return {
                loresheet: props.data.loresheet ?? loresheet,
                benefits: benefits ?? []
            };
        },
    });

    const [_drawer, openDrawer] = useRecoilState(drawerState);

    if (!data || !data.loresheet || !data.benefits) {
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
        );
    }

    return (
        <Stack>
            <LoresheetInitialOverview loresheet={data.loresheet} mode="READ" />
            {data.benefits && (
                <Stack>
                    {data.benefits.map((benefit, index) => (
                        <Box style={{ display: 'flex' }}>
                            <Text>
                                <Anchor 
                                    c="red"
                                    fz={'sm'}
                                    onClick={() => {
                                        openDrawer({
                                            type: 'loresheet_benefit',
                                            data: { id: benefit.id },
                                            extra: { addToHistory: true }
                                        })
                                    }}
                                >
                                    {generateDots(benefit.level)} {benefit.name}
                                </Anchor>
                            </Text>
                        </Box>
                    ))}
                </Stack>
            )}
        </Stack>
    )
}

export function LoresheetInitialOverview(props: {
    loresheet: Loresheet;
    mode: 'READ' | 'READ/WRITE';
}) {
    const theme = useMantineTheme();
    const kindred = useRecoilState(kindredState);
    const [_drawer, openDrawer] = useRecoilState(drawerState);

    const MODE = props.mode;

    let description = props.loresheet.description;

    return (
        <>
            <Box
                style={{
                    position: 'relative',
                }}
            >
                <Box
                >
                    {props.loresheet.artwork && (
                        <Image
                            style={{
                                float: 'right',
                                maxWidth: 200,
                                height: 'auto',
                            }}
                            ml='sm'
                            radius='md'
                            fit='contain'
                            src={supabase.storage.from('v5').getPublicUrl(props.loresheet.artwork).data.publicUrl}
                        />
                    )}
                    <Blockquote color="red">
                        <TypographyStylesProvider>
                            <Text dangerouslySetInnerHTML={{ __html: description }} size="sm" />
                        </TypographyStylesProvider>
                    </Blockquote>
                </Box>

            </Box>
        </>
    )

}