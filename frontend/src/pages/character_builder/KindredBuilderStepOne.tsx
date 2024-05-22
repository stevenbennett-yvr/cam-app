import { Avatar, Box, Stack, Group, rem, useMantineTheme, UnstyledButton, Title, TextInput } from "@mantine/core";
import { useElementSize, useMediaQuery } from "@mantine/hooks";
import { phoneQuery } from '../../utils/mobile-responsive'
import { openContextModal } from '@mantine/modals'
import { IconUserCircle } from "@tabler/icons-react";
import { DateInput } from '@mantine/dates'
import KindredBuilderCreationInner from './components/CharBuilderCreationInner'

export default function KindredBuilderStepOne(props: { pageHeight: number }) {
    const theme = useMantineTheme();


    const { ref, height } = useElementSize();
    const topGap = 30;
    const isPhone = useMediaQuery(phoneQuery())

    const iconStyle = { width: rem(12), height: rem(12) };

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
                                //                                defaultValue={character?.name === 'Unknown Wanderer' ? '' : character?.name}
                                onChange={() => {
                                    //
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

                    <Box>
                        <KindredBuilderCreationInner pageHeight={height}></KindredBuilderCreationInner>
                    </Box>

                </Stack>

            </Group>
        </Stack>
    )

}