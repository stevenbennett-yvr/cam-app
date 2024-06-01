import { Avatar, HoverCard, useMantineTheme, Text, Stack, Box, Button } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { LegacyRef, forwardRef } from "react";
import { phoneQuery } from "../utils/mobile-responsive";
import { Group } from "@mantine/core";
import { IconDroplets, IconGlass, IconLink } from "@tabler/icons-react";
import classes from '../css/UserInfoIcons.module.css'
import { Kindred } from "../typing/content";


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

        const hasSect = props.kindred?.details?.sect
        const hasClan = props.kindred?.details?.clan


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
                                    fw={500}
                                    className={classes.name}
                                >
                                    {'Placeholder Name'}
                                </Text>
                            </HoverCard.Target>
                            <HoverCard.Dropdown py={5} px={10}>
                                <Text c='gray.0' size='sm'>
                                    {'Placeholder Name'}
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
                                            Select Sect
                                        </Button>
                                    </Group>
                                ) : (


                                <Group wrap="nowrap" gap={10}>
                                    <IconLink stroke={1.5} size='1rem' className={classes.icon}/>
                                    <Text fz='xs' c='gray.3'>
                                        <>Missing Sect</>
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
                                            Select Clan
                                        </Button>
                                    </Group>
                                ) : (
                                <Group wrap="nowrap" gap={10}>
                                    <IconDroplets stroke={1.5} size='1rem' className={classes.icon}/>
                                    <Text fz='xs' c='gray.3'>
                                        <>Missing Clan</>

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
                                    <IconGlass stroke={1.5} size='1rem' className={classes.icon}/>
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

