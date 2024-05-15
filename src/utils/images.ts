/* export async function getShapeIcon(content: string) {
    const res = await fetch(`https://api.dicebear.com/7.x/shapes/svg?seed=${content}`);
    return res.ok ? await res.text() : '';
  }
  
  export async function getRingIcon(content: string) {
    const res = await fetch(`https://api.dicebear.com/7.x/rings/svg?seed=${content}`);
    return res.ok ? await res.text() : '';
  } */
  
  export async function isValidImage(url?: string): Promise<boolean> {
    if (!url) return false;
    const urlPattern = /^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}(\S*)$/;
    if (url.trim().match(urlPattern)) {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = function () {
          resolve(true);
        };
        img.onerror = function () {
          resolve(false);
        };
        img.src = url;
      });
    } else {
      return false;
    }
  }