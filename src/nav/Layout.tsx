import { ScrollArea, Stack, Divider, Menu, Box, AppShell, useMantineTheme, Group, Burger, Avatar, UnstyledButton, Text, rem } from "@mantine/core";
import React from "react";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
//import { useNavigate } from 'react-router-dom'
import { useState } from "react";
import classes from '../css/Layout.module.css'
import { IconChevronDown, IconUsers, IconAsset, IconSwords, IconFlag, IconSettings, IconLogout } from '@tabler/icons-react'


export default function Layout(props: { children: React.ReactNode }) {
    const theme = useMantineTheme();
    const [opened, { toggle, }] = useDisclosure();
    //    const navigate = useNavigate();

    const { width } = useViewportSize();

    const [pinned, setPinned] = useState(true);
    const SCROLL_PINNED_THRESHOLD = 20;
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    return (
        <AppShell
            header={{ height: 50, collapsed: !pinned, offset: opened }}
            navbar={{
                width: 300,
                breakpoint: 'md',
                collapsed: { desktop: true, mobile: !opened },
            }}
            padding='md'
        >
            <AppShell.Header
                h={50}
                style={{
                    border: `0px solid`,
                    borderRadius: 0,
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    // Add alpha channel to hex color (browser support: https://caniuse.com/css-rrggbbaa)
                    backgroundColor: theme.colors.dark[8] + 'CC',
                }}
            >
                <Group h='100%' px='md'>
                    <Burger opened={opened} onClick={toggle} hiddenFrom="md" />
                    <Group style={{ flex: 1 }}>
                        <Avatar size={30} />
                        <Group gap={0} style={{ flex: 1 }} visibleFrom="md" justify="space-between" wrap="nowrap">
                            {width >= 1050 ? (
                                <Group gap={0}>
                                    <UnstyledButton
                                        component='a'
                                        className={classes.control}
                                    >
                                        Community
                                    </UnstyledButton>
                                    <UnstyledButton
                                        component='a'
                                        className={classes.control}
                                    >
                                        Support
                                    </UnstyledButton>
                                </Group>
                            ) : (
                                <Box></Box>
                            )}
                            <Group>
                                {/* Search
                                
                                Once sessions are imlemented put a login button before menu
                                !session? (login) : (everything else)
                                */}
                                <Menu
                                    width={160}
                                    position='bottom-end'
                                    transitionProps={{ transition: 'pop-top-right' }}
                                    onClose={() => setUserMenuOpened(false)}
                                    onOpen={() => setUserMenuOpened(true)}
                                    withinPortal
                                >
                                    <Menu.Target>
                                        <UnstyledButton
                                            py={1}
                                            pr='xs'
                                            w={160}
                                            style={{
                                                borderTopLeftRadius: theme.radius.xl,
                                                borderBottomLeftRadius: theme.radius.xl,
                                                borderTopRightRadius: theme.radius.md,
                                                borderBottomRightRadius: theme.radius.md,
                                                backgroundColor: userMenuOpened ? '#14151750' : undefined,
                                            }}
                                        >
                                            <Group gap={7} wrap='nowrap' justify='space-between'>
                                                <Group gap={7} wrap='nowrap'>
                                                    <Avatar
                                                        alt={'Account Dropdown'}
                                                        radius='xl'
                                                        size={30}
                                                    />
                                                    <Text fw={500} size='sm' c='gray.4' lh={1} mr={3} truncate>
                                                        {'Account'}
                                                    </Text>
                                                </Group>
                                                <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                                            </Group>
                                        </UnstyledButton>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item
                                            leftSection={
                                                <IconUsers
                                                    style={{ width: rem(16), height: rem(16) }}
                                                    color={theme.colors.blue[5]}
                                                    stroke={1.5}
                                                />
                                            }
                                            component='a'
                                            href='/characters'

                                        >
                                            Characters
                                        </Menu.Item>
                                        <Menu.Item
                                            leftSection={
                                                <IconAsset
                                                    style={{ width: rem(16), height: rem(16) }}
                                                    color={theme.colors.yellow[6]}
                                                    stroke={1.5}
                                                />
                                            }
                                            component='a'
                                            href='/homebrew'
                                        >
                                            Homebrew
                                        </Menu.Item>
                                        <Menu.Item
                                            leftSection={
                                                <IconSwords
                                                    style={{ width: rem(16), height: rem(16) }}
                                                    color={theme.colors.teal[6]}
                                                    stroke={1.5}
                                                />
                                            }
                                            component='a'
                                            href='/encounters'
                                        >
                                            Encounters
                                        </Menu.Item>
                                        <Menu.Item
                                            leftSection={
                                                <IconFlag
                                                    style={{ width: rem(16), height: rem(16) }}
                                                    color={theme.colors.violet[4]}
                                                    stroke={1.5}
                                                />
                                            }
                                            component='a'
                                            href='/campaigns'
                                        >
                                            Campaigns
                                        </Menu.Item>

                                        <Menu.Label>Settings</Menu.Label>
                                        <Menu.Item
                                            leftSection={<IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                                            component='a'
                                            href='/account'

                                        >
                                            Account
                                        </Menu.Item>
                                        <Menu.Item
                                            leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                                        >
                                            Logout
                                        </Menu.Item>
                                    </Menu.Dropdown>

                                </Menu>
                            </Group>
                        </Group>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar
                py='md'
                px={4}
                style={{
                    border: `0px solid`,
                    borderRadius: 0,
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    // Add alpha channel to hex color (browser support: https://caniuse.com/css-rrggbbaa)
                    backgroundColor: theme.colors.dark[8] + 'CC',
                }}
            >
                <Stack gap={5}>
                    <UnstyledButton
                        className={classes.control}
                        component='a'

                    >
                        Characters
                    </UnstyledButton>
                    <UnstyledButton
                        className={classes.control}
                        component='a'

                    >
                        Homebrew
                    </UnstyledButton>
                    <UnstyledButton
                        className={classes.control}
                        component='a'

                    >
                        Encounters
                    </UnstyledButton>
                    <UnstyledButton
                        className={classes.control}
                        component='a'

                    >
                        Campaigns
                    </UnstyledButton>


                    <Divider />
                    <UnstyledButton
                        className={classes.control}
                        component='a'

                    >
                        Community
                    </UnstyledButton>
                    <UnstyledButton
                        className={classes.control}
                        component='a'

                    >
                        Support
                    </UnstyledButton>
                    <UnstyledButton
                        className={classes.control}
                        component='a'

                    >
                        Legacy Site
                    </UnstyledButton>
                    <Divider />
                    <UnstyledButton
                        className={classes.control}
                        component='a'

                    >
                        Account
                    </UnstyledButton>
                    <UnstyledButton
                        className={classes.control}
                    >
                        Logout
                    </UnstyledButton>
                </Stack>

            </AppShell.Navbar>
            <ScrollArea
                h={'100dvh'}
                type='auto'
                scrollbars='y'
                onScrollPositionChange={(pos) => {
                    if (pos.y > SCROLL_PINNED_THRESHOLD) {
                        setPinned(false);
                    } else {
                        setPinned(true);
                    }
                }}
            >
                <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>{props.children}</AppShell.Main>
            </ScrollArea>

        </AppShell>
    )
}