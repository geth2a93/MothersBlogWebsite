import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogService, BlogPost } from './blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  standalone: true,
  styleUrls: ['./blog.css'],
  imports: [CommonModule]
})
export class BlogComponent implements OnInit {
  // posts is an array of BlogPost
  posts: BlogPost[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    // Fetch posts from the service
    this.blogService.getPosts().subscribe((data: BlogPost[]) => {
      this.posts = data;
    });
  }
}