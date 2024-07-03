import { drawerState } from "@atoms/navAtoms";
import { fetchContentById } from "@content/content-store";
import { useQuery } from "@tanstack/react-query";
import { LoresheetBenefit } from "@typing/content";
import { useRecoilState, useRecoilValue } from "recoil";
import { Box, Group, Title, Button, useMantineTheme, Text, Loader, Blockquote, TypographyStylesProvider } from "@mantine/core";
import { generateDots } from "@utils/dots";
import { kindredState } from "@atoms/kindredAtoms";

export function LoresheetBenefitDrawerTitle(props: { data: { id?: number; benefit?: LoresheetBenefit; onSelect?: () => void } }) {
    const id = props.data.id;

    const [_drawer, openDrawer] = useRecoilState(drawerState);

    const { data: _benefit } = useQuery({
        queryKey: [`find-feat-${id}`, { id }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            // eslint-disable-next-line
            const [_key, { id }] = queryKey;
            return await fetchContentById<LoresheetBenefit>('loresheet_benefit', id);
        },
        enabled: !!id,
    });
    const benefit = props.data.benefit ?? _benefit;

    return (
        <>
            {benefit && (
                <Group justify="space-between" wrap="nowrap">
                    <Group wrap="nowrap" gap={10}>
                        <Box>
                            <Title order={3}>{generateDots(benefit.level)} {benefit.name}</Title>
                        </Box>
                    </Group>
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
                            Select Benefit
                        </Button>
                    )}
                </Group>
            )}
        </>
    );
};

export function LoresheetBenefitDrawerContent(props: { 
    data: { id?: number; benefit?: LoresheetBenefit },
    onMetadataChange?: (openedDict?: Record<string, string>) => void;
}) {
    const id = props.data.id;
    const theme = useMantineTheme();

    const kindred = useRecoilValue(kindredState)

    const { data: _benefit } = useQuery({
        queryKey: [`find-feat-${id}`, { id }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            // eslint-disable-next-line
            const [_key, { id }] = queryKey;
            return await fetchContentById<LoresheetBenefit>('loresheet_benefit', id);
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