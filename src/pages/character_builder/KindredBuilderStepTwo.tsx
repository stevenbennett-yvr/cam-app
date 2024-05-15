import { useMantineTheme, Group, Drawer, Title, Box, Stack, ScrollArea } from "@mantine/core";
import { isCharacterBuilderMobile } from "../../utils/screen-sizes";
import { useState } from "react";
import { CharacterInfo } from "../../common/CharacterInfo";
import { useElementSize } from "@mantine/hooks";
import { selectContent } from "../../common/select/SelectContent";
import { useRecoilState } from "recoil";
import { kindredState } from "../../atoms/kindredAtoms";
import { Sect, SectType } from "../../typing/content";


export default function KindredBuilderStepTwo(props: { pageHeight: number }) {
    const threme = useMantineTheme();
    const isMobile = isCharacterBuilderMobile();
    const [statPanelOpened, setStatPanelOpened] = useState(false);

    return (
        <Group gap={0}>
            {isMobile ? (
                <Drawer
                    opened={statPanelOpened}
                    onClose={() => {
                        setStatPanelOpened(false);
                    }}
                    title={<Title order={3}>Character Stats</Title>}
                    size='xs'
                    transitionProps={{ duration: 200 }}
                >
                    <CharacterStatSideBar pageHeight={props.pageHeight} />
                </Drawer>
            ) : (<Box style={{ flexBasis: '35%'}}>
                <CharacterStatSideBar pageHeight={props.pageHeight} />
            </Box>)}
        </Group>
    )
}

function CharacterStatSideBar(props: { pageHeight: number }) {
    const { ref, height } = useElementSize();
    const [kindred, setKindred] = useRecoilState(kindredState)

    return (
        <Stack gap={5}>
            <Box pb={5}>
                <CharacterInfo
                    kindred={kindred}
                    ref={ref}
                    onClickSect={() => {
                        selectContent<SectType>(
                            'sect',
                            (option) => {
                                setKindred((prev) => {
                                    if (!prev) return prev;
                                    return {
                                        ...prev,
                                        details: {
                                            ...prev.details,
                                            sect: option,
                                        },
                                    }
                                })
                            }
                        )
                    }}
                    onClickClan={() => {}}
                    onClickPredatorType={()=>{}}
                />
            </Box>
            <ScrollArea h={props.pageHeight - height - 20} pr={14} scrollbars='y'>

            </ScrollArea>
        </Stack>
    )
}