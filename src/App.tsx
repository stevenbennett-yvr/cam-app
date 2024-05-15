import { Box, MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals';
import { useState } from 'react';
import tinycolor from 'tinycolor2';
import Layout from './nav/Layout';
import CharacterBuilderPage from './pages/character_builder/KindredBuilderPage';
import SelectImageModal from './modals/SelectImageModal';
import SelectContentModal from './common/select/SelectContent';

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
  const generateTheme = () => {
    return createTheme({
      colors: {
        // @ts-ignore
        guide: getShadesFromColor('#359fdf'),
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
        <Notifications position='top-right' zIndex={9400} containerWidth={350} />
          <Box>
          <Layout>
            {/* Outlet is where react-router will render child routes */}
            <CharacterBuilderPage/>
          </Layout>
          </Box>

      </ModalsProvider>

    </MantineProvider>
  )


};