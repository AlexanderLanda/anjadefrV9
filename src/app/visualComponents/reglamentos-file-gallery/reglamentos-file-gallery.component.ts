import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import { ReglamentosFileServiceImpl } from 'src/app/Core/Service/Implements/ReglamentosFileServiceImpl';


@Component({
  selector: 'app-reglamentos-file-gallery',
  templateUrl: './reglamentos-file-gallery.component.html',
  styleUrls: ['./reglamentos-file-gallery.component.css']
})
export class ReglamentosFileGalleryComponent implements OnInit {


  @ViewChild('topOfGallery') topOfGallery: ElementRef;
  
  files: any[] = [];
  filteredFiles: any[] = [];
  paginatedFiles: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 8;
  totalPages: number = 0;
  isLoading: boolean = true;
  loadingProgress: number = 0;

  constructor(private fileService: ReglamentosFileServiceImpl) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.min.js';
  }
  ngOnInit() {
    this.loadFiles();
  }

  loadFiles() {
    this.isLoading = true;
    this.loadingProgress = 0;
    this.fileService.getFileList().subscribe(
      (data: any) => {
        this.files = data.files;
        this.generateThumbnails();
      },
      error => {
        console.error('Error loading file list:', error);
        this.isLoading = false;
      }
    );
  }

  async generateThumbnails() {
    const totalFiles = this.files.length;
    for (let i = 0; i < totalFiles; i++) {
      const file = this.files[i];
      file.thumbnail = await this.generateThumbnail(file);
      this.loadingProgress = Math.round(((i + 1) / totalFiles) * 100);
    }
    this.initializeFilesDisplay();
    this.isLoading = false;
  } 

  initializeFilesDisplay() {
    this.filteredFiles = [...this.files];
    this.totalPages = Math.ceil(this.filteredFiles.length / this.pageSize);
    this.updatePaginatedFiles();
  }

  async generateThumbnail(file: any): Promise<string> {
    if (file.type.startsWith('image/')) {
      return file.path;
    } else if (file.type === 'application/pdf') {
      const loadingTask = pdfjsLib.getDocument(file.path);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context!, viewport: viewport }).promise;
      return canvas.toDataURL();
    }
    return 'assets/icons/file-icon.png';
  }

  filterFiles(event : Event) {
    const filtro = (event?.target as HTMLInputElement).value;
    console.log(event);
    this.filteredFiles = this.files.filter(file => 
      file.name.toLowerCase().includes(filtro) || file.deporte.toLowerCase().includes(filtro)
    );
    this.totalPages = Math.ceil(this.filteredFiles.length / this.pageSize);
    this.currentPage = 1;
    this.updatePaginatedFiles();
  }

  updatePaginatedFiles() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedFiles = this.filteredFiles.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedFiles();
      this.scrollToTop();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedFiles();
      this.scrollToTop();
    }
  }

  scrollToTop() {
    setTimeout(() => {
      this.topOfGallery.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }
  openFile(file: any) {
    window.open(file.path, '_blank');
  }

  downloadFile(file: any) {
    const link = document.createElement('a');
    link.href = file.path;
    link.download = file.name;
    link.click();
  }

}
