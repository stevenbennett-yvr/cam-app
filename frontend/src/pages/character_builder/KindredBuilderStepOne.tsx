import { Image, Avatar, Box, Stack, Group, rem, useMantineTheme, UnstyledButton, Title, TextInput, Paper, Select, Text, ColorInput } from "@mantine/core";
import { useElementSize, useMediaQuery } from "@mantine/hooks";
import { phoneQuery } from '../../utils/mobile-responsive'
import { openContextModal } from '@mantine/modals'
import { IconKey, IconUserCircle } from "@tabler/icons-react";
import { DateInput } from '@mantine/dates'
import { UGLY_RED } from '../../constants/data';
import { getAllBackgroundImages } from "@utils/background-images";
import { useRecoilState } from "recoil";
import { kindredState } from "@atoms/kindredAtoms";

export default function KindredBuilderStepOne(props: { pageHeight: number }) {
    const theme = useMantineTheme();

    const { ref, height } = useElementSize();
    const topGap = 30;
    const isPhone = useMediaQuery(phoneQuery())

    const iconStyle = { width: rem(12), height: rem(12) };

    const [kindred, setKindred] = useRecoilState(kindredState)

    return (
        <Stack gap={topGap}>
            <Group justify='center' ref={ref} wrap='nowrap'>
                <Stack>
                    <Box>
                        <Group align='flex-end' wrap='nowrap'>
                            <UnstyledButton
                                onClick={() => {
                                    openContextModal({
                                        modal: 'selectImage',
                                        title: <Title order={3}>Select Portrait</Title>,
                                        innerProps: {
                                            options: [],
                                            onSelect: () => {
                                                //
                                            },
                                            category: 'portraits',
                                        },
                                    });
                                }}
                            >
                                <Avatar
                                    alt='Character Portrait'
                                    size='40'
                                    radius='xl'
                                    variant='transparent'
                                    color='dark.3'
                                    style={{
                                        border: `1px solid ${theme.colors.dark[4]}`,
                                    }}
                                    bg={theme.colors.dark[6]}
                                >
                                    <IconUserCircle size='1.5rem' stroke={1.5} />
                                </Avatar>
                            </UnstyledButton>
                            <TextInput
                                label='Name'
                                placeholder='Fledgeling'
                                defaultValue={kindred?.name === 'Unknown Wanderer' ? '' : kindred?.name}
                                onChange={(e) => {
                                    setKindred((prev) => {
                                        if (!prev) return prev;
                                        return {
                                            ...prev,
                                            name: e.target.value,
                                        };
                                    });
                                }}
                                w={isPhone ? undefined : 220}
                            />
                            <DateInput
                                maxDate={new Date()}
                                minDate={new Date(2023, 9, 1)}
                                defaultValue={new Date()}
                                label="Creation Date"
                            />
                        </Group>
                    </Box>
                </Stack>
            </Group>
            {isPhone ? (
                <Stack h={'100%'}>
                    <Box h={390}></Box>
                    {getSidebarSection()}
                </Stack>
            ) : (
                <Group gap={10} align='flex-start' wrap='nowrap' h={props.pageHeight - height - topGap}>
                    <Box style={{ flexBasis: '65%' }} h={'100%'}>

                    </Box>
                    <Box style={{ flexBasis: 'calc(35% - 10px)' }} h='100%'>
                        {getSidebarSection()}
                    </Box>
                </Group>
            )}

        </Stack>
    )
};

const getSidebarSection = () => (
    <Box h={'100%'}>
        <Paper
            shadow="sm"
            p={'sm'}
            h={'100%'}
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.13)'
            }}
        >
            <Stack>
                <Select
                    radius={'xl'}
                    size="xs"
                    label={<Text fz='sm'>Venue Style Sheet</Text>}
                    placeholder='Enter Venue ID'
                    rightSectionWidth={28}
                    leftSection={<IconKey style={{ width: rem(12), height: rem(12) }} stroke={1.5} />}
                    onClick={() => {

                    }}
                    searchable
                />
                <ColorInput
                    radius={'xl'}
                    size="xs"
                    label={<Text fz={'sm'}>Color Theme</Text>}
                    placeholder="Character Color Theme"
                    defaultValue={UGLY_RED}
                    swatches={[
                        '#25262b',
                        '#868e96',
                        '#fa5252',
                        '#e64980',
                        '#be4bdb',
                        '#8d69f5',
                        '#577deb',
                        UGLY_RED,
                        '#15aabf',
                        '#12b886',
                        '#40c057',
                        '#82c91e',
                        '#fab005',
                        '#fd7e14',
                    ]}
                    swatchesPerRow={7}
                    onChange={(color) => {
                        //setCharacter
                    }}
                />
                <Box>
                    <Text fz={'sm'}>Background Art</Text>
                    <UnstyledButton
                        w={'50%'}
                        onClick={() => {
                            openContextModal({
                                modal: 'selectImage',
                                title: <Title order={3}>Select Background</Title>,
                                innerProps: {
                                    options: getAllBackgroundImages(),
                                    onSelect: (option) => {
                                        //setCharacter
                                    },
                                    category: 'backgrounds',
                                },
                            });
                        }}
                    >
                        <Image
                            radius='md'
                            h='auto'
                            fit='contain'
                            fallbackSrc='/backgrounds/placeholder.jpeg'
                        />
                    </UnstyledButton>
                </Box>
            </Stack>
        </Paper>

    </Box>
)