import { drawerState } from "@atoms/navAtoms";
import { useRecoilValue } from "recoil";
import { getCachedCustomization } from "@content/customization-cache";
import _ from 'lodash-es';
import { SectDrawerContent } from "./types/SectDrawer";


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
        {_drawer?.type === 'sect' && <SectDrawerContent data={_drawer.data} />}
    </>
  )

}
