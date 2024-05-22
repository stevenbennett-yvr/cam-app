import { DrawerType } from '@typing/index';
import { ContentType } from '@typing/content';

export function convertContentLink(input: { type: ContentType | 'condition'; id: string }): {
  type: DrawerType;
  data: any;
} {
  return {
    type: input.type,
    data: { id: parseInt(input.id) ? parseInt(input.id) : input.id },
  };
}

export type PrevMetadata = {
  scrollTop: number;
  openedDict: Record<string, string>;
};

export function getMetadataOpenedDict() {
  const value = localStorage.getItem('prev-drawer-metadata');
  if (!value) return {};

  const metadata: PrevMetadata = JSON.parse(value);
  return metadata.openedDict;
}

export function mapToDrawerData(
  type: ContentType,
  data: Record<string, any> | number,
  dataInject?: Record<string, any>
): { type: DrawerType; data: any } {
  let drawerType: DrawerType = type;

  console.log('drawerType', drawerType, 'data', data, 'dataInject', dataInject);

  let drawerData: Record<string, any> = {};
  if (typeof data === 'number') {
    drawerData = { id: data, ...(dataInject ?? {}) };
  } else {
    let key = '';
    if (drawerType === 'sect') key = 'sect';
    drawerData = {
      [key]: data,
      ...(dataInject ?? {}),
    };
  }

  return { type: drawerType, data: drawerData };
}