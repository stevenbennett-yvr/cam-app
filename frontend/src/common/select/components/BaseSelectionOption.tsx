import { ButtonProps, useMantineTheme, Group, Text, Box, Button, Menu, rem, ActionIcon } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { useMediaQuery, useDidUpdate } from "@mantine/hooks";
import { phoneQuery } from "@utils/mobile-responsive";
import { IconDots, IconCopy, IconTrash } from "@tabler/icons-react";

export default function BaseSelectionOption(props: {
    selected?: boolean;
    buttonTitle?: string;
    buttonProps?: ButtonProps;
    includeOptions?: boolean;
    buttonOverride?: React.ReactNode;
    showButton?: boolean;
    onClick: () => void;
    onHover?: (active: boolean) => void;
    onButtonClick?: () => void;
    onOptionsDelete?: () => void;
    onOptionsCopy?: () => void;
    leftSection?: React.ReactNode;
    rightSection?: React.ReactNode;
    level?: string | number;
    noBackground?: boolean;
    disabled?: boolean;
    disableButton?: boolean;
    px?: number;
}) {
    const theme = useMantineTheme();
    const { hovered, ref } = useHover();
    const isPhone = useMediaQuery(phoneQuery())

    useDidUpdate(() => {
        props.onHover?.(hovered);
    }, [hovered]);

    const displayButton =
        (props.showButton || props.showButton === undefined) && (props.buttonTitle || props.buttonOverride);

    return (
        <Group
            ref={ref}
            py='sm'
            px={props.px ?? 'sm'}
            style={{
                cursor: 'pointer',
                borderBottom: '1px solid ' + theme.colors.dark[6],
                backgroundColor: (hovered || props.selected) && !props.noBackground ? theme.colors.dark[6] : 'transparent',
                position: 'relative',
                opacity: props.disabled ? 0.4 : 1,
                width: '100%',
                pointerEvents: props.disabled ? 'none' : undefined,
            }}
            onClick={displayButton ? props.onClick : props.onButtonClick ?? props.onClick}
            justify='space-between'
        >
            {props.level && parseInt(`${props.level}`) !== 0 && !isNaN(parseInt(`${props.level}`)) && (
                <Text
                    fz={10}
                    c='dimmed'
                    ta='right'
                    w={14}
                    style={{
                        position: 'absolute',
                        top: 15,
                        left: 1,
                    }}
                >
                    {props.level}.
                </Text>
            )}
            {props.leftSection && <Box>{props.leftSection}</Box>}
            {!isPhone && props.rightSection && (
                <Group wrap='nowrap' justify='flex-end' style={{ marginLeft: 'auto' }}>
                    <Box>{props.rightSection}</Box>
                    {displayButton ? <Box w={props.includeOptions ? 85 : 55}></Box> : null}
                </Group>
            )}

            {displayButton && (
                <>
                    {props.buttonOverride ? (
                        props.buttonOverride
                    ) : (
                        <>
                            {props.buttonTitle && (
                                <Box
                                    style={{
                                        position: 'absolute',
                                        top: 7,
                                        right: props.includeOptions ? 45 : 15,
                                    }}
                                >
                                    <Button
                                        disabled={props.disableButton}
                                        size='compact-xs'
                                        variant='filled'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            props.onButtonClick?.();
                                        }}
                                        {...props.buttonProps}
                                    >
                                        {props.buttonTitle}
                                    </Button>
                                </Box>
                            )}
                        </>
                    )}
                </>
            )}

            {props.includeOptions && (
                <Menu shadow='md' width={200}>
                    <Menu.Target>
                        <ActionIcon
                            size='sm'
                            variant='subtle'
                            color='gray.5'
                            radius='xl'
                            style={{
                                position: 'absolute',
                                top: 13,
                                right: 15,
                            }}
                            aria-label='Options'
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                            }}
                        >
                            <IconDots size='1rem' />
                        </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Label>Options</Menu.Label>
                        {props.onOptionsCopy && (
                            <Menu.Item
                                leftSection={<IconCopy style={{ width: rem(14), height: rem(14) }} />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    props.onOptionsCopy?.();
                                }}
                            >
                                Duplicate
                            </Menu.Item>
                        )}

                        {props.onOptionsDelete && (
                            <Menu.Item
                                color='red'
                                leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    props.onOptionsDelete?.();
                                }}
                            >
                                Delete
                            </Menu.Item>
                        )}
                    </Menu.Dropdown>
                </Menu>
            )}
        </Group>
    )
}