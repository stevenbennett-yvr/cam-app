import type { ContentType } from './content';

export type ImageOption = {
  name?: string;
  url: string;
  source?: string;
  source_url?: string;
};

export type DrawerType =
  | ContentType
  | AbilityBlockType
  | 'sect';

export type UploadResult = {
  success: boolean;
  id?: number;
};