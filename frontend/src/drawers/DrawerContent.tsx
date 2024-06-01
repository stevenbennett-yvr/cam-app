import { drawerState } from "@atoms/navAtoms";
import { useRecoilValue } from "recoil";
import { getCachedCustomization } from "@content/customization-cache";
import _ from 'lodash-es';
import { SectDrawerContent } from "./types/SectDrawer";
import { ClanDrawerContent } from "./types/ClanDrawer";
import { LoresheetDrawerContent } from "./types/LoresheetDrawer";
import { LoresheetBenefitDrawerContent } from "./types/LoresheetBenefitDrawer";
import { DisciplineDrawerContent } from "./types/DisciplineDrawer";
import { PowerDrawerContent } from "./types/PowerDrawer";


export default function DrawerContent(props: { onMetadataChange?: (openedDict?: Record<string, string>) => void }) {
    const _drawer = useRecoilValue(drawerState);

    let drawerData = _.cloneDeep(_drawer?.data ?? {});

  if (_drawer && getCachedCustomization()?.sheet_theme?.view_operations) {
    drawerData = {
      ...drawerData,
      showOperations: true,
    };
  }

  return (
    <>
        {_drawer?.type === 'sect' && <SectDrawerContent data={_drawer.data} onMetadataChange={props.onMetadataChange}  />}
        {_drawer?.type === 'clan' && <ClanDrawerContent data={_drawer.data} onMetadataChange={props.onMetadataChange}  />}
        {_drawer?.type === 'loresheet' && <LoresheetDrawerContent data={_drawer.data} onMetadataChange={props.onMetadataChange}  /> }
        {_drawer?.type === 'loresheet_benefit' && <LoresheetBenefitDrawerContent data={_drawer.data} onMetadataChange={props.onMetadataChange}  /> }
        {_drawer?.type === 'discipline' && <DisciplineDrawerContent data={_drawer.data} onMetadataChange={props.onMetadataChange} />}
        {_drawer?.type === 'power' && <PowerDrawerContent data={_drawer.data} onMetadataChange={props.onMetadataChange} />}
    </>
  )
}
