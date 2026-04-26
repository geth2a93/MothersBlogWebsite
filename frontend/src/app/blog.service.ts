import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  date_created: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  // Match current Flask route
  private apiUrl = 'http://127.0.0.1:5055/blog';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(this.apiUrl);
  }
}