import { Anchor, BackgroundImage, Box, MantineProvider, createTheme, Text } from '@mantine/core';
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals';
import { useEffect, useState } from 'react';
import tinycolor from 'tinycolor2';
import Layout from './nav/Layout';
import CharacterBuilderPage from './pages/character_builder/KindredBuilderPage';
import SelectImageModal from './modals/SelectImageModal';
import SelectContentModal from './common/select/SelectContent';
import { useRecoilState } from 'recoil';
import { drawerState } from '@atoms/navAtoms';
import DrawerBase from '@drawers/DrawerBase';
import { useMediaQuery } from '@mantine/hooks';
import { phoneQuery } from '@utils/mobile-responsive';
import { ImageOption } from './typing';
import { getDefaultBackgroundImage } from '@utils/background-images';
import { IconBrush } from '@tabler/icons-react';
import { UGLY_RED } from '@constants/data';

const modals = {
  selectContent: SelectContentModal,
  selectImage: SelectImageModal,
};
declare module '@mantine/modals' {
  export interface MantineModalsOverride {
    modals: typeof modals;
  }
}

function getShadesFromColor(color: string) {
  let lightShades = [];
  let darkShades = [];

  for (let i = 0; i < 3; i++) {
    let shade = tinycolor(color)
      .lighten(i * 3)
      .toString();
    lightShades.push(shade);
  }
  for (let i = 0; i < 7; i++) {
    let shade = tinycolor(color)
      .darken(i * 3)
      .toString();
    darkShades.push(shade);
  }

  return [...lightShades, color, ...darkShades];
}


export default function App() {
  const [_drawer, openDrawer] = useRecoilState(drawerState)
  const isPhone = useMediaQuery(phoneQuery());

  //Session stuff here


  const [background, setBackground] = useState<ImageOption>(getDefaultBackgroundImage());


  const generateTheme = () => {
    return createTheme({
      colors: {
        // @ts-ignore
        guide: getShadesFromColor(UGLY_RED),
        dark: [
          '#C1C2C5',
          '#A6A7AB',
          '#909296',
          '#5c5f66',
          '#373A40',
          '#2C2E33',
          '#25262b',
          '#1A1B1E',
          '#141517',
          '#101113',
        ],
      },
      cursorType: 'pointer',
      primaryColor: 'guide',
      defaultRadius: 'md',
      fontFamily: 'Montserrat, sans-serif',
      fontFamilyMonospace: 'Ubuntu Mono, monospace',
    });
  };


  const [theme,] = useState(generateTheme())

  return (
    <MantineProvider theme={theme} defaultColorScheme='dark'>
      <ModalsProvider modals={modals}>
        <BackgroundImage
          src={background?.url ?? ""}
          radius={0}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: -1000 }}
          w={'100dvw'}
          h={'100dvh'}
        />
        {background?.source?.trim() && !isPhone && (
          <Anchor href={background.source_url} target='_blank' underline='hover'>
          <Text
            size='xs'
            c='dimmed'
            style={{
              position: 'fixed',
              bottom: 6,
              right: 10,
              zIndex: 1,
            }}
          >
            <IconBrush size='0.5rem' /> {background.source}
          </Text>
        </Anchor>
        )}
        <Notifications position='top-right' zIndex={9400} containerWidth={350} />
          <Box>
          <Layout>
            {/* Outlet is where react-router will render child routes */}
            <CharacterBuilderPage/>
          </Layout>
          </Box>
      <DrawerBase />
      </ModalsProvider>
    </MantineProvider>
  )


};