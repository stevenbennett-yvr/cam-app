import { ImageOption } from "@typing/index";
import * as _ from 'lodash-es';
import { supabase } from "../main";

const imageStore: Record<string, ImageOption[]> = {
    Background: [
        {
            name: "photo of tram beside waiting station during nighttime",
            url: 'https://images.unsplash.com/photo-1516900557549-41557d405adf?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            source: "Filip Mroz",
            source_url: "https://unsplash.com/photos/photo-of-tram-beside-waiting-station-during-nighttime-023T4jyCRqA"
        },
        {
            name: "black asphalt road during night time",
            url: 'https://images.unsplash.com/photo-1554103577-c0d26e9b90e0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            source: "Igor Karimov",
            source_url: "https://unsplash.com/photos/black-asphalt-road-during-night-time-yX1HXelXmlQ"
        },
    ]
}

export function getBackgroundImageStore() {
    return _.cloneDeep(imageStore);
  }
  
  export function getAllBackgroundImages() {
    const images: ImageOption[] = [];
    for (const category of Object.keys(imageStore)) {
      images.push(...imageStore[category]);
    }
    return images;
  }
  
  export async function getBackgroundImageFromURL(url?: string) {
    const background = getAllBackgroundImages().find((image) => image.url === url) ?? {
      name: 'Custom',
      url: url ?? '',
    };
    return await getBackgroundImageInternal(background);
  }
  
  export async function getBackgroundImageFromName(category: string, name: string) {
    const background = imageStore[category].find((image) => image.name === name);
    return await getBackgroundImageInternal(background);
  }
  
  async function getBackgroundImageInternal(background?: ImageOption) {
    if (!background || !background.url) {
      return getDefaultBackgroundImage();
    }
  
    const isValid = await isImageValid(background.url);
    if (isValid) {
      return _.cloneDeep(background);
    } else {
      return getOfflineBackgroundImage();
    }
  }

  export function getOfflineBackgroundImage() {
    return _.cloneDeep(imageStore.Background[0]);
  }
 
  export function getDefaultBackgroundImage() {
    return _.cloneDeep(imageStore.Background[0]);
  }
  
  async function isImageValid(src: string) {
    return new Promise((resolve) => {
      const img = new Image();
  
      img.onload = () => {
        resolve(true);
      };
  
      img.onerror = () => {
        resolve(false);
      };
  
      img.src = src; // Set the source to trigger loading
  
      // Set a timeout to handle cases where the image takes too long to load.
      setTimeout(() => {
        img.src = ''; // Abort the image loading
        resolve(false);
      }, 2500);
    });
  }