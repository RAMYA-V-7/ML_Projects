import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cameraFilter'
})
export class CameraFilterPipe implements PipeTransform {
  transform(imageFeeds: any[], selectedCamera: string): any[] {
    if (!imageFeeds || !selectedCamera) {
      return imageFeeds;
    }
    return imageFeeds.filter(feed => feed.cameraName === selectedCamera);
  }
}