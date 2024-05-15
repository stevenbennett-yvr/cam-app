import { Drawer, Group, Title, Box } from '@mantine/core'
import { isCharacterBuilderMobile } from "../../../utils/screen-sizes";
import { useState } from 'react';

export default function KindredBuilderCreationInner(props: {
    pageHeight: number;
}) {
    const isMobile = isCharacterBuilderMobile();
    const [statPanelOpened, setStatPanelOpened] = useState(false);

    return (
        <Group>
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
                </Drawer>
            ) : (
                <Box style={{ flexBasis: '35%' }}>
                </Box>
            )}
        </Group>

    )
}
