import { drawerState } from '@atoms/navAtoms';
import { forwardRef, LegacyRef } from 'react';
import { useRecoilValue } from 'recoil';
import { SectDrawerTitle } from './types/SectDrawer';

const DrawerTitle = forwardRef((props: {}, ref: LegacyRef<HTMLDivElement>) => {
    const _drawer = useRecoilValue(drawerState);
    return (
        <div ref={ref}>
            {_drawer?.type === 'sect' && <SectDrawerTitle data={_drawer.data} />} 
        </div>
    )
})

export default DrawerTitle