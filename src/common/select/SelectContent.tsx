import { rem, Button, Menu, Text, ActionIcon, Indicator, CloseButton, MultiSelect, Checkbox, Popover, Divider, Title, useMantineTheme, Box, Overlay, ScrollArea, Center, Pagination, Group, ButtonProps, Stack, FocusTrap, TextInput, Avatar } from "@mantine/core";
import { useDebouncedState, useDidUpdate, useHover, useMediaQuery } from "@mantine/hooks";
import { openContextModal, ContextModalProps, modals } from "@mantine/modals";
import React, { useRef, useState } from "react";
import { ContentType, Sect } from '../../typing/content'
import { FilterOptions, SelectedFilter } from "./filters";
import { useRecoilState } from 'recoil'
import { drawerState } from "../../atoms/navAtoms";
import { kindredState } from "../../atoms/kindredAtoms";
import { phoneQuery } from "../../utils/mobile-responsive";
import { IconSearch, IconFilter, IconCopy, IconDots, IconTrash } from "@tabler/icons-react";
import { useQuery } from '@tanstack/react-query'
import { fetchContentAll } from "../../process/content/content-store";

export function selectContent<T = Record<string, any>>(
    type: ContentType,
    onClick?: (optoin: T) => void,
    options?: {
        overrideOptions?: Record<string, any>[];
        overrideLabel?: string;
        groupBySource?: boolean;
        selectedId?: number;
        filterFn?: (option: Record<string, any>) => boolean;
        showButton?: boolean;
        includeOptions?: boolean;
        filterOptions?: FilterOptions;
    }
) {
    let label = `Select ${type}`;
    if (options?.overrideLabel) label = options.overrideLabel;

    openContextModal({
        modal: 'selectContent',
        title: <Title order={3}>{label}</Title>,
        innerProps: {
            type,
            onClick: onClick ? (option) => onClick(option as T) : undefined,
            options,
        },
    });

}

export default function SelectContentModal({
    context,
    id,
    innerProps,
}: ContextModalProps<{
    type: ContentType;
    onClick?: (option: Record<string, any>) => void;
    options?: {
        overrideOptions?: Record<string, any>[];
        groupBySource?: boolean;
        selectedId?: number;
        filterFn?: (option: Record<string, any>) => boolean;
        showButton?: boolean;
        includeOptions?: boolean;
        filterOptions?: FilterOptions;
    }
}>) {
    const [openedDrawer, setOpenedDrawer] = useState(false);

    const theme = useMantineTheme();

    const [searchQuery, setSearchQuery] = useDebouncedState("", 200);
    const [openedFilters, setOpenedFilters] = useState(false);
    const [filterSelections, setFilterSelections] = useState<Record<string, SelectedFilter>>({});

    const updateFilterSelection = (key: string, selectedFilter: SelectedFilter) => {
        const value = selectedFilter.value;
        if (!value || (Array.isArray(value) && value.length === 0)) {
            // Remove
            const newFilterSelections = { ...filterSelections };
            delete newFilterSelections[key];
            setFilterSelections(newFilterSelections);
        } else {
            // Add
            setFilterSelections((prev) => ({ ...prev, [key]: selectedFilter }));
        }
    };


    const getSelectionContents = (selectionOptions: React.ReactNode) => {
        return (
            <Stack gap={10}>
                <Group wrap='nowrap'>
                    <FocusTrap active={true}>
                        <TextInput
                            data-autofocus
                            style={{ flex: 1 }}
                            leftSection={<IconSearch size='0.9rem' />}
                            placeholder={`Search`}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            styles={{
                                input: {
                                    borderColor: searchQuery.trim().length > 0 ? theme.colors['guide'][8] : undefined,
                                },
                            }}
                        />
                    </FocusTrap>
                    {innerProps.options?.filterOptions && (
                        <Popover
                            width={200}
                            position='bottom'
                            withArrow
                            shadow='md'
                            opened={openedFilters}
                            closeOnClickOutside={false}
                        >
                            <Popover.Target>
                                <Indicator
                                    inline
                                    label={`${Object.keys(filterSelections).length}`}
                                    size={16}
                                    zIndex={1000}
                                    disabled={Object.keys(filterSelections).length === 0}
                                >
                                    <ActionIcon
                                        size='lg'
                                        variant='light'
                                        radius='md'
                                        aria-label='Filters'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setOpenedFilters(!openedFilters);
                                        }}
                                    >
                                        <IconFilter size='1rem' />
                                    </ActionIcon>
                                </Indicator>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <Group wrap="nowrap" justify="space-between">
                                    <Title order={5}>Filters</Title>
                                    <CloseButton
                                        onClick={() => {
                                            setOpenedFilters(false);
                                        }}
                                    />
                                </Group>
                                <Divider mt={5} />
                                <Stack gap={10} pt={5}>
                                    {innerProps.options.filterOptions.options.map((option, index) => (
                                        <Box key={index}>
                                            {option.type === 'MULTI-SELECT' && (
                                                <MultiSelect
                                                    label={option.title}
                                                    data={option.options ?? []}
                                                    onChange={(value) => {
                                                        updateFilterSelection(option.key, { filter: option, value });
                                                    }}
                                                    value={filterSelections[option.key]?.value ?? []}
                                                />
                                            )}
                                            {option.type === 'CHECKBOX' && (
                                                <Checkbox
                                                    label={option.title}
                                                    checked={filterSelections[option.key]?.value ?? false}
                                                    onChange={(event) => {
                                                        updateFilterSelection(option.key, {
                                                            filter: option,
                                                            value: event.currentTarget.checked,
                                                        });
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    ))}
                                </Stack>

                            </Popover.Dropdown>
                        </Popover>
                    )}
                </Group>
                {selectionOptions}
            </Stack>
        )
    }


    return (
        <Box style={{ position: 'relative', height: 490 }}>
            {openedDrawer && (
                <Overlay
                    color={theme.colors.dark[7]}
                    backgroundOpacity={0.35}
                    blur={2}
                    zIndex={99}
                    onClick={() => {
                        setOpenedDrawer(false);
                    }}
                />
            )}

            <Box>
                {getSelectionContents(
                    <SelectionOptions
                        type={innerProps.type}
                        selectedId={innerProps.options?.selectedId}
                        overrideOptions={innerProps.options?.overrideOptions}
                        searchQuery={searchQuery}
                        onClick={
                            innerProps.onClick
                                ? (option) => {
                                    innerProps.onClick!(option);
                                    context.closeModal(id);
                                }
                                : undefined
                        }
                        includeOptions={innerProps.options?.includeOptions}
                        showButton={innerProps.options?.showButton}
                        limitSelectedOptions={!!innerProps.options?.overrideOptions}
                    />
                )}
            </Box>

        </Box>
    )
}

function SelectionOptions(props: {
    searchQuery: string;
    type: ContentType;
    sourceId?: number | 'all';
    onClick?: (option: Record<string, any>) => void;
    selectedId?: number;
    overrideOptions?: Record<string, any>[];
    filterFn?: (option: Record<string, any>) => boolean;
    includeOptions?: boolean;
    showButton?: boolean;
    limitSelectedOptions: boolean;
}) {

    const { data, isFetching } = useQuery({
        queryKey: [`select-content-options-${props.type}`, { sourceId: props.sourceId }],
        queryFn: async ({ queryKey }) => {
            // @ts-ignore
            // eslint-disable-next-line
            const [_key, { sourceId }] = queryKey;
            return (await fetchContentAll(props.type, sourceId === 'all' || !sourceId ? undefined : [sourceId])) ?? null;
        },
        refetchOnMount: true,
        //enabled: !props.overrideOptions, Run even for override options to update JsSearch
    });

    let options = [] as Record<string, any>[];

    let filteredOptions = options;

    filteredOptions = filteredOptions.sort((a, b) => {
        if (a.level !== undefined && b.level !== undefined) {
            if (a.level !== b.level) {
                // Sort greatest first if it's overrideOptions
                if (props.overrideOptions) {
                    return b.level - a.level;
                } else {
                    return a.level - b.level;
                }
            }
        } else if (a.rank !== undefined && b.rank !== undefined) {
            if (a.rank !== b.rank) {
                // Sort greatest first if it's overrideOptions
                if (props.overrideOptions) {
                    return b.rank - a.rank;
                } else {
                    return a.rank - b.rank;
                }
            }
        }
        return a.name.localeCompare(b.name);
    });

    return (
        <SelectionOptionsInner
            options={filteredOptions}
            type={props.type}
            onClick={props.onClick}
            selectedId={props.selectedId}
            showButton={props.showButton}
            includeOptions={props.includeOptions}
        />
    );
}

export function SelectionOptionsInner(props: {
    options: Record<string, any>[];
    type: ContentType;
    onClick?: (option: Record<string, any>) => void;
    selectedId?: number;
    includeOptions?: boolean;
    showButton?: boolean;
    onDelete?: (id: number) => void;
    onCopy?: (id: number) => void;
    h?: number;
}) {
    const NUM_PER_PAGE = 20;
    const [activePage, setPage] = useState(1);

    const viewport = useRef<HTMLDivElement>(null);
    const scrollToTop = () => viewport.current?.scrollTo({ top: 0 });

    const typeName = props.type;

    if (props.options.length === 0) {
        return (
            <Box pt='lg'>
                <Text fz='md' c='dimmed' ta='center' fs='italic'>
                    No {typeName} found!
                </Text>
            </Box>
        );
    }

    return (
        <>
            <ScrollArea viewportRef={viewport} h={props.h ?? 372} scrollbars='y' style={{ position: 'relative' }}>
                <SelectionOptionsRoot
                    options={props.options.slice((activePage - 1) * NUM_PER_PAGE, activePage * NUM_PER_PAGE)}
                    type={props.type}
                    onClick={props.onClick ? props.onClick : () => { }}
                    selectedId={props.selectedId}
                    showButton={props.showButton}
                    includeOptions={props.includeOptions}
                    onDelete={props.onDelete}
                    onCopy={props.onCopy}
                />
            </ScrollArea>
            <Center>
                <Pagination
                    size='sm'
                    total={Math.ceil(props.options.length / NUM_PER_PAGE)}
                    value={activePage}
                    onChange={(value) => {
                        setPage(value);
                        scrollToTop();
                    }}
                />
            </Center>
        </>
    );
}


function SelectionOptionsRoot(props: {
    options: Record<string, any>[];
    type: ContentType;
    onClick: (option: Record<string, any>) => void;
    selectedId?: number;
    includeOptions?: boolean;
    showButton?: boolean;
    onDelete?: (id: number) => void;
    onCopy?: (id: number) => void;
}) {
    // Render appropriate options based on type
    if (props.type === 'sect') {
        return (
            <>
                {props.options.map((sect, index) => (
                    <SectSelectionOption
                        key={'class-' + index}
                        sect={sect as Sect}
                        onClick={props.onClick}
                        selected={props.selectedId === sect.id}
                        hasSelected={props.selectedId !== undefined}
                        showButton={props.showButton}
                        includeOptions={props.includeOptions}
                        onDelete={props.onDelete}
                        onCopy={props.onCopy}
                    />
                ))}
            </>
        );
    }
    if (props.type === 'clan') {
        return (
            <>
                {props.options.map((sect, index) => (
                    <SectSelectionOption
                        key={'class-' + index}
                        sect={sect as Sect}
                        onClick={props.onClick}
                        selected={props.selectedId === sect.id}
                        hasSelected={props.selectedId !== undefined}
                        showButton={props.showButton}
                        includeOptions={props.includeOptions}
                        onDelete={props.onDelete}
                        onCopy={props.onCopy}
                    />
                ))}
            </>
        );
    }
    if (props.type === 'predator-type') {
        return (
            <>
                {props.options.map((sect, index) => (
                    <SectSelectionOption
                        key={'class-' + index}
                        sect={sect as Sect}
                        onClick={props.onClick}
                        selected={props.selectedId === sect.id}
                        hasSelected={props.selectedId !== undefined}
                        showButton={props.showButton}
                        includeOptions={props.includeOptions}
                        onDelete={props.onDelete}
                        onCopy={props.onCopy}
                    />
                ))}
            </>
        );
    }

    // Generic ability block. Probably used for variables.
    return (
        <>
            {props.options.map((sect, index) => (
                <SectSelectionOption
                    key={'class-' + index}
                    sect={sect as Sect}
                    onClick={props.onClick}
                    selected={props.selectedId === sect.id}
                    hasSelected={props.selectedId !== undefined}
                    showButton={props.showButton}
                    includeOptions={props.includeOptions}
                    onDelete={props.onDelete}
                    onCopy={props.onCopy}
                />
            ))}
        </>
    );
}


export function SectSelectionOption(props: {
    sect: Sect;
    onClick: (sect: Sect) => void;
    selected?: boolean;
    hasSelected?: boolean;
    showButton?: boolean;
    includeOptions?: boolean;
    onDelete?: (id: number) => void;
    onCopy?: (id: number) => void;
}) {
    const [_drawer, openDrawer] = useRecoilState(drawerState);
    const kindred = useRecoilState(kindredState)

    const openConfirmModal = () =>
        modals.openConfirmModal({
            id: 'change-option',
            title: <Title order={4}>Change Ancestry</Title>,
            children: (
                <Text size='sm'>
                    Are you sure you want to change your Sect?
                </Text>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onCancel: () => { },
            onConfirm: () => props.onClick(props.sect),
        });

    const onSelect = () => {
        if (props.hasSelected && !props.selected) {
            openConfirmModal()
        } else {
            props.onClick(props.sect)
        }
    }

    return (
        <BaseSelectionOption
            leftSection={
                <Group wrap="nowrap">
                    <Avatar
                        src={props.sect.artwork_url}
                        radius='sm'
                        styles={{
                            image: {
                                objectFit: 'contain'
                            }
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <Text size='sm' fw={500}>
                            {props.sect.name}
                        </Text>

                    </div>
                </Group>
            }
            showButton={props.showButton}
            selected={props.selected}
            onClick={() =>
                openDrawer({
                    type: 'sect',
                    data: {
                        id: props.sect.id,
                        onSelect: props.showButton || props.showButton === undefined ? () => onSelect() : undefined,
                    },
                    extra: { addToHistory: true }
                })
            }
            buttonTitle="Select"
            disableButton={props.selected}
            onButtonClick={() => onSelect()}
            includeOptions={props.includeOptions}
            onOptionsDelete={() => props.onDelete?.(props.sect.id)}
            onOptionsCopy={() => props.onCopy?.(props.sect.id)}
        />
    )
}




export function BaseSelectionOption(props: {
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