import { drawerState } from "@atoms/navAtoms";
import { useElementSize, useLocalStorage, useMediaQuery, useDidUpdate } from "@mantine/hooks";
import { phoneQuery } from "@utils/mobile-responsive";
import useRefresh from "@utils/use-refresh";
import { Suspense, lazy, useRef } from "react";
import { useRecoilState } from "recoil";
import { PrevMetadata } from "./drawer-utils";
import { Box, Drawer, Group, Loader, Title, Divider, ActionIcon, ScrollArea } from "@mantine/core";
import { IconArrowLeft, IconX } from "@tabler/icons-react";


const DrawerContent = lazy(() => import('./DrawerContent'));
const DrawerTitle = lazy(() => import('./DrawerTitle'));

export default function DrawerBase() {

    const isPhone = useMediaQuery(phoneQuery());

    const [_drawer, openDrawer] = useRecoilState(drawerState);

    const { ref, height: titleHeight } = useElementSize();
    const [displayTitle, refreshTitle] = useRefresh();

    const viewport = useRef<HTMLDivElement>(null);
    const [value, setValue] = useLocalStorage<PrevMetadata>({
        key: 'prev-drawer-metadata',
        defaultValue: {
            scrollTop: 0,
            openedDict: {},
        },
    });

    const saveMetadata = (openedDict?: Record<string, string>) => {
        const newMetadata = {
            scrollTop: viewport.current!.scrollTop ?? 0,
            openedDict: openedDict ?? value.openedDict,
        };
        setValue(newMetadata);
    }

    const handleDrawerClose = () => {
        openDrawer(null);
    };


    const handleDrawerGoBack = () => {
        let history = [...(_drawer?.extra?.history ?? [])];
        const newDrawer = history.pop();
        if (!newDrawer) return handleDrawerClose();

        openDrawer({
            type: newDrawer.type,
            data: newDrawer.data,
            extra: {
                history,
            },
        });

        setTimeout(() => {
            viewport.current!.scrollTo({ top: value.scrollTop });
        }, 1);
    };

    useDidUpdate(() => {
        refreshTitle();
    }, [_drawer]);

    const opened = !!_drawer;

    return (
        <>
            <Drawer
                opened={opened}
                onClose={handleDrawerClose}
                title={
                    <>
                        {displayTitle && (
                            <Box ref={ref}>
                                <Group gap={12} justify='space-between'>
                                    <Box style={{ flex: 1 }}>
                                        {opened && (
                                            <Suspense
                                                fallback={
                                                    <Group wrap='nowrap' gap={10}>
                                                        <Loader size='sm' />
                                                        <Title order={3}>Loading...</Title>
                                                    </Group>
                                                }
                                            >
                                                <DrawerTitle />
                                            </Suspense>
                                        )}
                                        <Divider />
                                    </Box>
                                    {!!_drawer?.extra?.history?.length ? (
                                        <ActionIcon
                                            variant='light'
                                            color='gray.4'
                                            radius='lx'
                                            size='md'
                                            onClick={handleDrawerGoBack}
                                            aria-label='Go back to previous drawer'
                                        >
                                            <IconArrowLeft size='1.2rem' stroke={1.5} />
                                        </ActionIcon>
                                    ) : (
                                        <ActionIcon
                                            variant='light'
                                            color='gray.4'
                                            radius='xl'
                                            size='md'
                                            onClick={handleDrawerClose}
                                            aria-label='Close drawer'
                                        >
                                            <IconX size='1.2rem' stroke={1.5} />
                                        </ActionIcon>
                                    )}
                                </Group>
                            </Box>
                        )}
                    </>
                }
                withCloseButton={false}
                position="right"
                zIndex={_drawer?.data.zIndex ?? 1000}
                styles={{
                    title: {
                        width: '100%',
                    },
                    header: {
                        paddingBottom: 0,
                    },
                    body: {
                        paddingRight: 2,
                    },
                }}
                transitionProps={{ duration: 200 }}
                style={{
                    overflow: 'hidden',
                }}
            >
                <ScrollArea
                    viewportRef={viewport}
                    h={isPhone ? undefined : `calc(100dvh - (${titleHeight || 30}px + 48px))`}
                    pr={16}
                    scrollbars='y'
                >
                    <Box
                        pt={2}
                        style={{
                            overflowX: 'hidden'
                        }}
                    >
                            {opened && (
                                <Suspense fallback={<div></div>}>
                                    <DrawerContent
                                        onMetadataChange={(openedDict) => {
                                            saveMetadata(openedDict)
                                        }}
                                    />
                                </Suspense>
                            )}
                    </Box>
                </ScrollArea>
            </Drawer>
        </>
    )

}