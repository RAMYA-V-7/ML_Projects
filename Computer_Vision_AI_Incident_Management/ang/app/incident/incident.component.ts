import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

interface ImageFeed {
  image: string;
  hoverImage?: string;
  cameraNumber: number;
  cameraName: string;
  plantNumber: number;
}

interface IncidentImage {
  newImage: string;
  modelImage: string;
  date: string;
  timestamp: string;
  cameraNumber: number;
  cameraName: string;
  plantNumber: number;
}

@Component({
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.css']
})

export class IncidentComponent implements OnInit, OnDestroy {
  title = 'incident-management';
  videoSrc: string | null = null;
  clickCount = 0;
  currentRightImages: IncidentImage[] = [];
  pageSize = 1;
  currentPage = 0;
  modelImage:any;
  
  videoPaths: string[] = [
    "E:/cctv/flask/files_upload/fireee1.mp4",
    "E:/cctv/flask/files_upload/fire2.mp4",
    "E:/cctv/flask/files_upload/fireee3.mp4",
    "E:/cctv/flask/files_upload/fireee4.mp4",
    "E:/cctv/flask/files_upload/helmm1.mp4",
    "E:/cctv/flask/files_upload/helmm2.mp4",
    "E:/cctv/flask/files_upload/helmmmmm3.mp4",
    "E:/cctv/flask/files_upload/helmmmm4.mp4",
    "E:/cctv/flask/files_upload/helmet_running.webm",
    "E:/cctv/flask/files_upload/helmm.mp4",
    "E:/cctv/flask/files_upload/fire1.mp4",
    "E:/cctv/flask/files_upload/fire2.mp4"
  ];

  imageFeeds: ImageFeed[] = [
    { image: 'https://imagetolink.com/ib/tOomdIEhUX.jpg', hoverImage: 'https://imagetolink.com/ib/O9qklyb4vk.jpg', cameraNumber: 1, cameraName: 'Camera 1', plantNumber: 1 },
    { image: 'https://imagetolink.com/ib/NeHutf7vEw.jpg', hoverImage: 'https://imagetolink.com/ib/O9qklyb4vk.jpg',cameraNumber: 2, cameraName: 'Camera 2', plantNumber: 1 },
    { image: 'https://imagetolink.com/ib/ycFJ7TE4CN.jpg', hoverImage: 'https://imagetolink.com/ib/O9qklyb4vk.jpg',cameraNumber: 3, cameraName: 'Camera 3', plantNumber: 2 },
    { image: 'https://imagetolink.com/ib/Hb41bT1Nq5.jpg',hoverImage: 'https://imagetolink.com/ib/O9qklyb4vk.jpg', cameraNumber: 4, cameraName: 'Camera 4', plantNumber: 2 },
    { image: 'https://imagetolink.com/ib/aZWPczXRcp.jpg', hoverImage: 'https://imagetolink.com/ib/O9qklyb4vk.jpg',cameraNumber: 5, cameraName: 'Camera 5', plantNumber: 3 },
    { image: 'https://imagetolink.com/ib/XozR0b8DMx.jpg',hoverImage: 'https://imagetolink.com/ib/O9qklyb4vk.jpg', cameraNumber: 6, cameraName: 'Camera 6', plantNumber: 3 },
    { image: 'https://imagetolink.com/ib/HgkY9ik5o7.jpg', hoverImage: 'https://imagetolink.com/ib/O9qklyb4vk.jpg',cameraNumber: 7, cameraName: 'Camera 7', plantNumber: 4 },
    { image: 'https://imagetolink.com/ib/6N0iN85f0c.jpg', hoverImage: 'https://imagetolink.com/ib/O9qklyb4vk.jpg', cameraNumber: 8, cameraName: 'Camera 8', plantNumber: 4 },
  ];

  newImages: string[] = [
    'https://imagetolink.com/ib/O9O0XwIJ0K.jpg',
    'https://imagetolink.com/ib/anvATGFDML.jpg',
    'https://imagetolink.com/ib/bLtFMIO53c.jpeg',
    'https://imagetolink.com/ib/X2C4tWmdKq.jpg',
    'https://imagetolink.com/ib/k1CQDNxbV9.jpg',
    'https://imagetolink.com/ib/ITwHdKtCh3.jpg',
    'https://imagetolink.com/ib/NxQflavY0w.jpg',
    'https://imagetolink.com/ib/TDr8NUa38G.jpg',
  ];

  plantNumbers: number[] = Array.from(new Set(this.imageFeeds.map(feed => feed.plantNumber)));

  private clickedGrids = new Set<number>(); 
  private timers: any[] = []; 

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.startTimers();
    
  }

  ngOnDestroy() {
   
    this.timers.forEach(timer => clearInterval(timer));
  }

  startTimers() {
    this.imageFeeds.forEach((feed, index) => {
      this.startTimer(index);
    });
  }

  startTimer(index: number) {
    this.timers[index] = setInterval(() => {
      const currentTime = new Date();
      const hours = String(currentTime.getHours()).padStart(2, '0');
      const minutes = String(currentTime.getMinutes()).padStart(2, '0');
      const seconds = String(currentTime.getSeconds()).padStart(2, '0');
      const timerElement = document.getElementById(`timer-${index}`);
      if (timerElement) {
        timerElement.innerHTML = `${hours}:${minutes}:${seconds}`;
      }
    }, 1000);
  }

  getCurrentDate(): string {
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = String(currentTime.getMonth() + 1).padStart(2, '0'); 
    const day = String(currentTime.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  getCurrentTimestamp(): string {
    const currentTime = new Date();
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  onMouseEnter(event: Event) {
    const target = event.target as HTMLImageElement;
    const hoverImage = target.getAttribute('data-hover');
    if (hoverImage) {
      target.src = hoverImage;
    }
  }

  onMouseLeave(event: Event) {
    const target = event.target as HTMLImageElement;
    const originalImage = this.imageFeeds.find(feed => feed.hoverImage === target.src)?.image;
    if (originalImage) {
      target.src = originalImage;
    }
  }

  uploadVideo(index: number) {
    if (this.clickedGrids.has(index)) {
      return;
    }

    this.clickedGrids.add(index);
    if (index != 1 && index != 2 && index != 4 && index != 5) {
      this.clickCount++;
    }
    


    const videoPath: string = this.videoPaths[index];
    const formData = new FormData();
    formData.append('file', videoPath);
    formData.append('model', videoPath.includes('fire') ? 'fire' : 'helmet'); 

    this.http.post('http://localhost:5000/upload', formData).subscribe(
      (response: any) => {
        if (response.file && response.model) {
          this.videoSrc = `http://localhost:5000/video_feed?file=${response.file}&model=${response.model}`;
        
          // const modelImage = response.model === 'fire' ? 'https://imagetolink.com/ib/ItbcAZPThs.jpg' : 'https://imagetolink.com/ib/juKG2vpNsj.jpg';
          const currentDate = this.getCurrentDate(); 
          const currentTimestamp = this.getCurrentTimestamp(); 
          const feed = this.imageFeeds[index]; 
          let modelImage = '';
          switch(index) {
            case 0:
              modelImage = 'https://imagetolink.com/ib/v09zJFCZL6.png';
              break;
            case 3:
              modelImage = 'https://imagetolink.com/ib/MNdWkJlaiI.png';
              break;
            case 6:
              modelImage = 'https://imagetolink.com/ib/i6XQAhDUWS.png';
              break;
            case 7:
              modelImage = 'https://imagetolink.com/ib/V5i2iWLdtj.png';
           
          }
         
          if (index != 1 && index != 2 && index != 4 && index != 5) {
            this.currentRightImages.unshift({
              newImage: this.newImages[index],
              modelImage: modelImage,
              date: currentDate, 
              timestamp: currentTimestamp, 
              cameraNumber: feed.cameraNumber, 
              cameraName: feed.cameraName,
              plantNumber: feed.plantNumber 
            });
          }

         
          this.sendIncidentEmail(index, currentDate, currentTimestamp, feed.cameraNumber, feed.cameraName, feed.plantNumber, this.newImages[index], modelImage);
        }
      },
      error => {
        console.error('Error uploading video:', error);
      }
    );
  }

  sendIncidentEmail(index: number, date: string, timestamp: string, cameraNumber: number, cameraName: string, plantNumber: number, newImage: string, modelImage: string) {
    let subject = '';
    let body = '';
    let sendEmail = true;
    if (index === 0 ) {
      subject = 'Fire Is Detected';
      body = `Dear Mark M, There is a Confirmed Fire Detected in Camera Number: ${cameraNumber} on ${date} at ${timestamp}.`;
      newImage =  "https://imagetolink.com/ib/O9O0XwIJ0K.jpg"
      this.snackBar.open('Email sent to the Quality Assurance Supervisor - Fire Emergency', 'Close', { duration: 7000, verticalPosition: 'top' });
    } else if (index === 3 ) {
      subject = 'Fire Is Detected';
      body = `Dear Mary K, There is a Confirmed Fire Detected in Camera Number: ${cameraNumber} on ${date} at ${timestamp}.`;
      newImage =  "https://imagetolink.com/ib/X2C4tWmdKq.jpg"
      this.snackBar.open('Email sent to the Production Supervisor - Fire Emergency', 'Close', { duration: 7000, verticalPosition: 'top' });
    }
    else if (index === 6 ) {
      subject = 'No helmet is detected';
      body = `Dear Steven B, Please Ensure All Personnel Are Wearing Helmets. Incident Detected in Camera Number: ${cameraNumber} on ${date} at ${timestamp}.`;
      newImage =  "https://imagetolink.com/ib/NxQflavY0w.jpg"
      this.snackBar.open('Email sent to the Field Operations Supervisor - Please Ensure All Personnel Are Wearing Helmets.', 'Close', { duration: 7000, verticalPosition: 'top' });
    }else if (index === 7) {
      subject = 'No helmet is detected';
      body = `Dear Chris W, Please Ensure All Personnel Are Wearing Helmets. Incident Detected in Camera Number: ${cameraNumber} on ${date} at ${timestamp}.`;
       newImage =  "https://imagetolink.com/ib/TDr8NUa38G.jpg"
      this.snackBar.open('Email sent to the Site Engineer Supervisor - Please Ensure All Personnel Are Wearing Helmets.', 'Close', { duration: 7000, verticalPosition: 'top' });
    }else {
      sendEmail = false;
    }

    if (sendEmail) {
    const emailParams = {
      to_name: `Plant ${plantNumber} Supervisor`,
      from_name: 'Security Team',
      subject: subject,
      message: body,
      new_image: newImage
    };

    emailjs.send('service_s0p1peu', 'template_gi47c7i', emailParams, 'ZXzyRKpvxbJBPXqcn')
      .then((response: EmailJSResponseStatus) => {
        console.log('Email successfully sent!', response.status, response.text);
      }, (error) => {
        console.error('Failed to send email. Error:', error);
      });
  }
  }
  sortPlants(event: Event) {
    const selectedOption = (event.target as HTMLSelectElement).value;
  
    // Initial image feeds
    const allFeeds = [
      { image: 'https://imagetolink.com/ib/tOomdIEhUX.jpg', hoverImage: 'https://imagetolink.com/ib/O9qklyb4vk.jpg', cameraNumber: 1, cameraName: 'Camera 1', plantNumber: 1 },
      { image: 'https://imagetolink.com/ib/NeHutf7vEw.jpg', hoverImage: 'https://imagetolink.com/ib/O9qklyb4vk.jpg',cameraNumber: 2, cameraName: 'Camera 2', plantNumber: 1 },
      { image: 'https://imagetolink.com/ib/ycFJ7TE4CN.jpg', hoverImage: 'https://imagetolink.com/ib/O9qklyb4vk.jpg',cameraNumber: 3, cameraName: 'Camera 3', plantNumber: 2 },
      { image: 'https://imagetolink.com/ib/Hb41bT1Nq5.jpg',hoverImage: 'https://imagetolink.com/ib/O9qklyb4vk.jpg', cameraNumber: 4, cameraName: 'Camera 4', plantNumber: 2 },
      { image: 'https://imagetolink.com/ib/aZWPczXRcp.jpg', hoverImage: 'https://imagetolink.com/ib/O9qklyb4vk.jpg',cameraNumber: 5, cameraName: 'Camera 5', plantNumber: 3 },
      { image: 'https://imagetolink.com/ib/XozR0b8DMx.jpg',hoverImage: 'https://imagetolink.com/ib/O9qklyb4vk.jpg', cameraNumber: 6, cameraName: 'Camera 6', plantNumber: 3 },
      { image: 'https://imagetolink.com/ib/HgkY9ik5o7.jpg', hoverImage: 'https://imagetolink.com/ib/O9qklyb4vk.jpg',cameraNumber: 7, cameraName: 'Camera 7', plantNumber: 4 },
      { image: 'https://imagetolink.com/ib/6N0iN85f0c.jpg', hoverImage: 'https://imagetolink.com/ib/O9qklyb4vk.jpg', cameraNumber: 8, cameraName: 'Camera 8', plantNumber: 4 },
    ];
  
    if (selectedOption === 'all') {
      // Reset imageFeeds to show all images
      this.imageFeeds = allFeeds;
    } else {
      const selectedPlantNumber = parseInt(selectedOption, 10);
      this.imageFeeds = allFeeds.filter(feed => feed.plantNumber === selectedPlantNumber);
    }
  }
  
}
