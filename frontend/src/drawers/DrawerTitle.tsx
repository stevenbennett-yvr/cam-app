import { drawerState } from '@atoms/navAtoms';
import { forwardRef, LegacyRef } from 'react';
import { useRecoilValue } from 'recoil';
import { SectDrawerTitle } from './types/SectDrawer';
import { ClanDrawerTitle } from './types/ClanDrawer';
import { LoresheetDrawerTitle } from './types/LoresheetDrawer';
import { LoresheetBenefitDrawerTitle } from './types/LoresheetBenefitDrawer';
import { DisciplineDrawerTitle } from './types/DisciplineDrawer';
import { PowerDrawerTitle } from './types/PowerDrawer';

const DrawerTitle = forwardRef((props: {}, ref: LegacyRef<HTMLDivElement>) => {
    const _drawer = useRecoilValue(drawerState);
    return (
        <div ref={ref}>
            {_drawer?.type === 'sect' && <SectDrawerTitle data={_drawer.data} />} 
            {_drawer?.type === 'clan' && <ClanDrawerTitle data={_drawer.data} />}
            {_drawer?.type === 'loresheet' && <LoresheetDrawerTitle data={_drawer.data} />}
            {_drawer?.type === 'loresheet_benefit' && <LoresheetBenefitDrawerTitle data={_drawer.data} />}
            {_drawer?.type === 'discipline' && <DisciplineDrawerTitle data={_drawer.data} />}
            {_drawer?.type === 'power' && <PowerDrawerTitle data={_drawer.data} />}
        </div>
    )
})

export default DrawerTitle