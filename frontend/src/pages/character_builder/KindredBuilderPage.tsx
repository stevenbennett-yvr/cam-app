import { Text, ScrollArea, Center, Box, Stack, rem, useMantineTheme, ActionIcon, Stepper } from "@mantine/core";
import { useState } from "react";
import { isCharacterBuilderMobile } from '../../utils/screen-sizes'
import { IconArrowRight, IconArrowLeft, IconHome, IconHammer, IconUser } from "@tabler/icons-react";
import BlurBox from "../../common/BlurBox";
import KindredBuilderCore from "./KindredBuilderStepOne";
import KindredBuilderStepTwo from "./KindredBuilderStepTwo";
import { useRecoilState } from "recoil";
import { kindredState } from "@atoms/kindredAtoms";

export default function Component() {

    const theme = useMantineTheme();
    const [active, setActive] = useState(0);

    const handleStepChange = (nextStep: number) => {
        const isOutOfRange = nextStep > 3 || nextStep < 0;
        if (isOutOfRange) {
            return;
        }
        setActive(nextStep);
    }

    const stepIconStyle = { width: rem(18), height: rem(18) };
    const pageHeight = 550;
    
    const [kindred, setKindred] = useRecoilState(kindredState)

    return (
        <Center>
            <Box maw={800} w='100%' pb='sm'>
                <Stack style={{ position: "relative" }}>
                    {!isCharacterBuilderMobile() && (
                        <>
                            <ActionIcon
                                variant='filled'
                                color='gray'
                                aria-label='Next Page'
                                radius={60}
                                size={60}
                                style={{
                                    backdropFilter: `blur(8px)`,
                                    WebkitBackdropFilter: `blur(8px)`,
                                    // Add alpha channel to hex color (browser support: https://caniuse.com/css-rrggbbaa)
                                    backgroundColor: theme.colors.dark[8] + 'D3',
                                    position: 'absolute',
                                    top: '45%',
                                    right: -100,
                                    visibility: active === 2 ? 'hidden' : 'visible',
                                }}
                                onClick={() => handleStepChange(active + 1)}
                            >
                                <IconArrowRight size='1.7rem' stroke={2} />
                            </ActionIcon>
                            <ActionIcon
                                variant='filled'
                                color='gray'
                                aria-label='Previous Page'
                                radius={60}
                                size={60}
                                style={{
                                    backdropFilter: `blur(8px)`,
                                    WebkitBackdropFilter: `blur(8px)`,
                                    // Add alpha channel to hex color (browser support: https://caniuse.com/css-rrggbbaa)
                                    backgroundColor: theme.colors.dark[8] + 'D3',
                                    position: 'absolute',
                                    top: '45%',
                                    left: -100,
                                    visibility: active === 0 ? 'hidden' : 'visible',
                                }}
                                onClick={() => handleStepChange(active - 1)}
                            >
                                <IconArrowLeft size='1.7rem' stroke={2} />
                            </ActionIcon>
                        </>
                    )}
                    <BlurBox blur={10} p='sm'>
                        <Stepper
                            active={active}
                            onStepClick={setActive}
                            iconSize={isCharacterBuilderMobile() ? undefined : 40}
                            size={isCharacterBuilderMobile() ? 'xs' : 'lg'}
                            wrap={false}
                        >
                            <Stepper.Step
                                label='Home'
                                allowStepSelect={true}
                                icon={<IconHome style={stepIconStyle} />}
                                completedIcon={<IconHome style={stepIconStyle} />}
                            >
                                <ScrollArea h={pageHeight} scrollbars='y'>
                                    <KindredBuilderCore pageHeight={pageHeight}/>
                                </ScrollArea>
                            </Stepper.Step>
                            <Stepper.Step
                                label='Builder'
                                allowStepSelect={true}
                                icon={<IconHammer style={stepIconStyle} />}
                                completedIcon={<IconHammer style={stepIconStyle} />}
                            >
                                <ScrollArea h={pageHeight} scrollbars='y'>
                                    <KindredBuilderStepTwo pageHeight={pageHeight}/>
                                </ScrollArea>
                            </Stepper.Step>
                            <Stepper.Step
                                label='Sheet'
                                icon={<IconUser style={stepIconStyle} />}
                                completedIcon={<IconUser style={stepIconStyle} />}
                            >
                                <ScrollArea h={pageHeight} scrollbars='y'>
                                    <Text ta='center'>Redirecting to sheet...</Text>
                                </ScrollArea>
                            </Stepper.Step>

                            <Stepper.Completed>
                                <ScrollArea h={pageHeight} scrollbars='y'>
                                    Complete
                                </ScrollArea>
                            </Stepper.Completed>
                        </Stepper>

                    </BlurBox>
                </Stack>
            </Box>
        </Center>
    )
}