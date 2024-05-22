import { kindredState } from "@atoms/kindredAtoms";
import { drawerState } from "@atoms/navAtoms";
import { fetchContentById } from "@content/content-store";
import { useQuery } from "@tanstack/react-query";
import { Sect } from "@typing/content";
import { useRecoilState } from "recoil";
import { Blockquote, Group, Box, Text, Button, Loader, Stack, useMantineTheme, Image, TypographyStylesProvider, Divider } from "@mantine/core";
import { useState } from "react";
import { supabase } from "../../main";

export function SectDrawerTitle(props: { data: { id?: number; sect?: Sect; onSelect?: () => void } }) {
    const id = props.data.id;

    const [_drawer, openDrawer] = useRecoilState(drawerState)

    const { data: _sect } = useQuery({
        queryKey: [`find-sect-${id}`, { id }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            // eslint-disable-next-line
            const [_key, { id }] = queryKey;
            return await fetchContentById<Sect>('sect', id);
        },
        enabled: !!id,
    })
    const sect = props.data.sect ?? _sect;

    if (!_sect) {
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

    const logoUrl = supabase.storage.from('v5').getPublicUrl(_sect.logo).data.publicUrl

    return (
        <>
            {sect && (
                <Group justify="center" wrap='nowrap'>

                    {logoUrl && (
                        <Image
                            style={{
                                float: 'left',
                                height: 'auto',
                                maxWidth: '60%',
                                objectFit: 'contain',
                                filter: 'invert(1)'
                            }}
                            ml='sm'
                            radius='md'
                            fit='contain'
                            src={logoUrl}
                        />
                    )}

                    {props.data.onSelect && (
                        <Button
                            variant="filled"
                            radius='xl'
                            mb={5}
                            size='compact-sm'
                            onClick={() => {
                                props.data.onSelect?.();
                                openDrawer(null);
                            }}
                        >
                            Select Sect
                        </Button>
                    )}
                </Group>
            )}
        </>
    )
}

export function SectDrawerContent(props:
    { data: { id?: number; sect?: Sect; }; }
) {
    const id = props.data.id;

    const { data: _sect } = useQuery({
        queryKey: [`find-sect-${id}`, { id }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            // eslint-disable-next-line
            const [_key, { id }] = queryKey;
            return await fetchContentById<Sect>('sect', id);
        },
        enabled: !!id,
    })

    console.log(_sect)

    if (!_sect) {
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
            <SectInitialOverview
                sect={_sect}
                mode='READ'
            />
        </Stack>
    )

}


export function SectInitialOverview(props: {
    sect: Sect;
    mode: 'READ' | 'READ/WRITE'
}) {
    const theme = useMantineTheme();
    const [descHidden, setDescHidden] = useState(true);
    const kindred = useRecoilState(kindredState);
    const [_drawer, openDrawer] = useRecoilState(drawerState);

    const artworkUrl = supabase.storage.from('v5').getPublicUrl(props.sect.artwork).data.publicUrl

    return (
        <>
            <Box
                style={{
                    position: 'relative'
                }}
            >
                <Box
                    mah={descHidden ? 400 : undefined}
                    style={{
                        WebkitMaskImage: descHidden ? 'linear-gradient(to bottom, black 60%, transparent 100%)' : undefined,
                        maskImage: descHidden ? 'linear-gradient(to bottom, black 60%, transparent 100%)' : undefined,
                        overflowY: descHidden ? 'hidden' : undefined,
                    }}
                >
                    {props.sect.artwork && (
                        <Image
                            style={{
                                float: 'right',
                                maxWidth: '100%',
                                height: 'auto',
                            }}
                            ml='sm'
                            radius='md'
                            fit='contain'
                            src={artworkUrl}
                        />
                    )}
                </Box>
                {props.sect.description && (
                    <Box>
                        <Divider
                            px='xs'
                            label={
                                <Text fz='xs' c='gray.6'>
                                    <Group gap={5}>
                                        <Box>Description</Box>
                                    </Group>
                                </Text>
                            }
                            labelPosition='left'
                        />
                        <Blockquote color="red">
                            <TypographyStylesProvider>
                                <div dangerouslySetInnerHTML={{ __html: props.sect.description }} />
                            </TypographyStylesProvider>
                        </Blockquote>
                    </Box>
                )}

            </Box>
        </>
    )
}

