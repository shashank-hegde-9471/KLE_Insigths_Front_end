import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { map, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventSService {

  constructor(public http:HttpClient,private route:Router) { }

  private eventUpdated = new Subject<{events:Event[],EventCount:number}>();
  private event2:any[]=[];
  uri="https://insights-ngy8.onrender.com";

  getEvents( ){

    this.http.get<{message:string,events:any,maxEvents:number}>(this.uri+'/api/event' )
    .pipe(map((postData)=>{
      // console.log(postData);
      return {posts : postData.events.map((post:any)=>{
        return {
          id:post._id,
          ClubID:post.ClubID,
          description:post.description,
          eDate:post.eDate,
          time:post.time,
          venue:post.venue
        };
      }),maxEvents:postData.maxEvents};
    })
    )
    .subscribe(transformedPostData=>{
      // console.log(transformedPostData);
      this.event2=transformedPostData.posts;
      this.eventUpdated.next({events:[...this.event2],EventCount:transformedPostData.maxEvents});
    });
  }

  getEventUpdatedListener(){
    return this.eventUpdated.asObservable();
  }
  deleteEvents(id:string)
  {
    return this.http.delete(this.uri+"/api/event/delete/"+id);
  }
}
