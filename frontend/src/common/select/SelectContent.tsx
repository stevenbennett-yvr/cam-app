import { Loader, Text, ActionIcon, Indicator, CloseButton, MultiSelect, Checkbox, Popover, Divider, Title, useMantineTheme, Box, Overlay, ScrollArea, Center, Pagination, Group, Stack, FocusTrap, TextInput, Avatar, Button, Transition } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { openContextModal, ContextModalProps } from "@mantine/modals";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { ContentType } from '../../typing/content'
import { FilterOptions, SelectedFilter } from "./filters";
import { IconSearch, IconFilter, IconX } from "@tabler/icons-react";
import { useQuery } from '@tanstack/react-query'
import { fetchContentAll } from "../../process/content/content-store";

import SelectionOptionsRoot from "./components/SelectionOptionsRoot";
import { useRecoilState } from "recoil";
import { drawerState } from "@atoms/navAtoms";
import { DrawerType } from "@typing/index";
import * as JsSearch from 'js-search';
import { toLabel } from "@utils/to-label";

export function SelectContentButton<T extends Record<string, any> = Record<string, any>>(props: {
    type: ContentType;
    onClick: (option: T) => void;
    onClear?: () => void;
    selectedId?: number;
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
}) {
    const [_drawer, openDrawer] = useRecoilState(drawerState);
    const [selected, setSelected] = useState<T | undefined>();

    const typeName = props.type

    const label = selected ? selected.name : props.options?.overrideLabel ?? `Select ${toLabel(typeName)}`;

    const onSelect = () => {
        selectContent<T>(
            props.type,
            (option) => {
                setSelected(option);
                props.onClick(option);
            },
            {
                overrideOptions: props.options?.overrideOptions,
                overrideLabel: props.options?.overrideLabel,
                groupBySource: props.options?.groupBySource,
                selectedId: props.options?.selectedId,
                filterFn: props.options?.filterFn,
                showButton: props.options?.showButton,
                includeOptions: props.options?.includeOptions,
                filterOptions: props.options?.filterOptions,
            }
        )
    }

    const drawerType: DrawerType = props.type;
    const onView = () => {
        openDrawer({
            type: drawerType,
            data: { id: selected?.id },
            extra: { addToHistory: true },
        });
    };

    return (
        <Button.Group className='selection-choice-base'>
            <Button
                className={selected ? 'selection-choice-selected' : 'selection-choice-unselected'}
                variant={selected ? 'light' : 'filled'}
                size='compact-sm'
                radius='xl'
                w={160}
                onClick={() => {
                    if (selected) {
                        onView();
                    } else {
                        onSelect()
                    }
                }}
            >
                {label}
            </Button>
            {selected && (
                <>
                    <Button
                        variant='light'
                        size='compact-sm'
                        radius='xl'
                        onClick={() => {
                            setSelected(undefined);
                            props.onClear && props.onClear();
                        }}
                        style={{
                            borderLeft: '1px solid'
                        }}
                    >
                        <IconX size='1rem' />
                    </Button>
                </>
            )}
        </Button.Group>
    )
}

export function selectContent<T = Record<string, any>>(
    type: ContentType,
    onClick?: (option: T) => void,
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
            //Remove
            const newFilterSelections = { ...filterSelections };
            delete newFilterSelections[key];
            setFilterSelections(newFilterSelections);
        } else {
            // Add
            setFilterSelections((prev) => ({ ...prev, [key]: selectedFilter }));
        }
    }

    const getMergedFilterFn = () => {
        const newFilterFn = (option: Record<string, any>) => {
            for (const key of Object.keys(filterSelections)) {
                const value = option[key];
                const selectedFilter = filterSelections[key];
                if (selectedFilter.filter.filterFn) {
                    return selectedFilter.filter.filterFn(option);
                }
                const filterValue = selectedFilter.value;
                if (Array.isArray(value)) {
                    if (Array.isArray(filterValue)) {
                        if (!value.some((val) => filterValue.includes(val))) {
                            return false;
                        }
                    } else {
                        if (!filterValue.includes(value)) {
                            return false;
                        }
                    }
                } else if (typeof value === 'number') {
                    if (Array.isArray(filterValue)) {
                        if (!filterValue.find((val) => `${val}` === `${value}`)) {
                            return false;
                        }
                    } else {
                        if (`${value}` !== `${filterValue}`) {
                            return false;
                        }
                    }
                } else if (typeof value === 'string') {
                    if (Array.isArray(filterValue)) {
                        if (!filterValue.find((val) => value.toLowerCase().includes(val.toLowerCase()))) {
                            return false;
                        }
                    } else {
                        if (!value.toLowerCase().includes(filterValue.toLowerCase())) {
                            return false;
                        }
                    }
                } else if (typeof value === 'boolean') {
                    if (Array.isArray(filterValue)) {
                        if (!filterValue.find((val) => val === value)) {
                            return false;
                        }
                    } else {
                        if (value !== filterValue) {
                            return false;
                        }
                    }
                } else if (!value) {
                    return false;
                }
            }
            return innerProps.options?.filterFn ? innerProps.options.filterFn(option) : true;
        };
        return newFilterFn;
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
                        filterFn={getMergedFilterFn()}
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

    let options = useMemo(() => (data ? [...data.values()] : []), [data]);
    if (props.overrideOptions) options = props.overrideOptions;
    options = options.filter((d) => d).filter(props.filterFn ? props.filterFn : () => true)

    const search = useRef(new JsSearch.Search('id'));
    useEffect(() => {
        if (!options) return;
        search.current.addIndex('name');
        //search.current.addIndex('description');
        search.current.addDocuments(options);
    }, [options]);
    let filteredOptions = props.searchQuery
        ? (search.current.search(props.searchQuery) as Record<string, any>[])
        : options;

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
        else if (a.category !== undefined && b.category !== undefined) {
            if (a.category !== b.category) {
                // Sort greatest first if it's overrideOptions
                if (props.overrideOptions) {
                    return b.category.localeCompare(a.category);
                } else {
                    return a.category.localeCompare(b.category);
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
            isLoading={isFetching || !options}
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
    isLoading: boolean;
    selectedId?: number;
    includeOptions?: boolean;
    showButton?: boolean;
    onDelete?: (id: number) => void;
    onCopy?: (id: number) => void;
    h?: number;
}) {
    const NUM_PER_PAGE = 20;
    const [activePage, setPage] = useState(1);

    useEffect(() => {
        setPage(1);
        scrollToTop();
    }, [props.options.length]);

    const viewport = useRef<HTMLDivElement>(null);
    const scrollToTop = () => viewport.current?.scrollTo({ top: 0 });

    const typeName = props.type;

    if (!props.isLoading && props.options.length === 0) {
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

                {props.isLoading ? (
                    <Loader
                        type='bars'
                        style={{
                            position: 'absolute',
                            top: '35%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                ) : (
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
                )}

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

