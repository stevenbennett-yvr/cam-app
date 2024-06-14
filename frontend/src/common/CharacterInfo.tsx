import { Avatar, HoverCard, useMantineTheme, Text, Stack, Box, Button } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { LegacyRef, forwardRef } from "react";
import { phoneQuery } from "../utils/mobile-responsive";
import { Group } from "@mantine/core";
import { IconDroplets, IconGlass, IconLink } from "@tabler/icons-react";
import classes from '../css/UserInfoIcons.module.css'
import { Kindred, Sect } from "../typing/content";
import { truncate } from "lodash-es";
import { useQuery } from "@tanstack/react-query";
import { fetchContentById } from "@content/content-store";
import { Clan } from "@typing/kindredTypes/clan";


export const CharacterInfo = forwardRef(
    (
        props: {
            kindred: Kindred | null;
            onClick?: () => void;
            onClickSect?: () => void;
            onClickClan?: () => void;
            onClickPredatorType?: () => void;
            onClickLoresheet?: () => void;
            hideImage?: boolean;
            color?: string;
            nameCutOff?: number;
        },
        ref: LegacyRef<HTMLDivElement>
    ) => {
        const theme = useMantineTheme();
        const isPhone = useMediaQuery(phoneQuery());

        const sectId = props.kindred?.details?.sectID
        const hasSect = sectId !== undefined
        const clanId = props.kindred?.details?.clanID
        const hasClan = clanId !== undefined

        const { data } = useQuery({
            queryKey: [`find-character-info-${props?.kindred?.id}`, { sectId, clanId }],
            queryFn: async ({ queryKey }) => {
                // @ts-ignore
                // eslint-disable-next-line
                const [_key, { sectId, clanId }] = queryKey;
                const sect = await fetchContentById<Sect>('sect', sectId);
                const clan = await fetchContentById<Clan>('clan', clanId);
                return {
                    sect,
                    clan
                }
            },
            enabled: !!props.kindred?.details?.sectID,
        })
        const sect = data?.sect;
        const clan = data?.clan;

        return (
            <div ref={ref} style={{ width: isPhone ? undefined : 240 }}>
                <Group wrap='nowrap' align='flex-start' gap={0}>
                    {!props.hideImage && (
                        <Avatar
                            alt='Character Portrait'
                            size={75}
                            radius={75}
                            mt={10}
                            ml={5}
                            mr={10}
                            variant='transparent'
                            color='dark.3'
                            bg={theme.colors.dark[6]}
                        />
                    )}
                    <div style={{ flex: 1 }}>
                        <HoverCard shadow='md' openDelay={1000} position='top' withinPortal>
                            <HoverCard.Target>
                                <Text
                                    c='gray.0'
                                    fz={props.kindred && props.kindred.name.length >= 16 ? '0.9rem' : 'lg'}
                                    fw={500}
                                    className={classes.name}
                                >
                                    {truncate(props.kindred?.name, {
                                        length: props.nameCutOff ?? 18
                                    })}
                                </Text>
                            </HoverCard.Target>
                            <HoverCard.Dropdown py={5} px={10}>
                                <Text c='gray.0' size='sm'>
                                    {props.kindred?.name}
                                </Text>
                            </HoverCard.Dropdown>
                        </HoverCard>

                        <Stack gap={3}>
                            <Box>
                                {props.onClickSect ? (
                                    <Group gap={0}>
                                        <Button
                                            variant={hasSect ? 'subtle' : 'filled'}
                                            color={props.color}
                                            size='compact-xs'
                                            leftSection={<IconLink size='0.9rem' />}
                                            onClick={props.onClickSect}
                                            fw={400}
                                        >
                                            {sect?.name ?? "Select Sect"}
                                        </Button>
                                    </Group>
                                ) : (
                                    <Group wrap="nowrap" gap={10}>
                                        <IconLink stroke={1.5} size='1rem' className={classes.icon} />
                                        <Text fz='xs' c='gray.3'>
                                            {sect?.name ? (
                                                <>
                                                    {sect.name}
                                                </>
                                            ) : (
                                                <>Missing Sect</>
                                            )}
                                        </Text>
                                    </Group>
                                )}
                            </Box>
                            <Box>
                                {props.onClickClan ? (
                                    <Group gap={0}>
                                        <Button
                                            variant={hasClan ? 'subtle' : 'filled'}
                                            color={props.color}
                                            size='compact-xs'
                                            leftSection={<IconDroplets size='0.9rem' />}
                                            onClick={props.onClickClan}
                                            fw={400}
                                        >
                                            {clan?.name ?? "Select Clan"}
                                        </Button>
                                    </Group>
                                ) : (
                                    <Group wrap="nowrap" gap={10}>
                                        <IconDroplets stroke={1.5} size='1rem' className={classes.icon} />
                                        <Text fz='xs' c='gray.3'>
                                            {clan?.name ? (
                                                <>
                                                    {clan.name}
                                                </>
                                            ) : (
                                                <>Missing Clan</>
                                            )}
                                        </Text>
                                    </Group>
                                )}
                            </Box>
                            <Box>
                                {props.onClickPredatorType ? (
                                    <Group gap={0}>
                                        <Button
                                            //                                            variant={hasAncestry ? 'subtle' : 'filled'}
                                            color={props.color}
                                            size='compact-xs'
                                            leftSection={<IconGlass size='0.9rem' />}
                                            //                                            onClick={props.onClickAncestry}
                                            fw={400}
                                        >
                                            Select Predator Type
                                        </Button>
                                    </Group>
                                ) : (
                                    <Group wrap="nowrap" gap={10}>
                                        <IconGlass stroke={1.5} size='1rem' className={classes.icon} />
                                        <Text fz='xs' c='gray.3'>
                                            <>Missing Predator Type</>
                                        </Text>
                                    </Group>
                                )}
                            </Box>
                        </Stack>

                    </div>
                </Group >
            </div >
        );
    }
);

