import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, empty, Observable, of, Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { User, UserWithPagination } from 'src/app/lib/interfaces';
import { UserService } from 'src/app/lib/services';
import Notiflix from "notiflix";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetailsComponent } from './details/details.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  faTrash = faTrash;
  searchFrm: FormGroup;
  pageTitle: string;
  type: string;
  users$: Observable<UserWithPagination>;

  toggleStstuSubScr: Subscription;
  delRefreshUserSubScr: Subscription;
  searchSubScription: Subscription;
  constructor(private route:ActivatedRoute,
    private userService: UserService,
    private _modalService: NgbModal,
    private formBuilder: FormBuilder) { }



  toggleStatus(user: User){
    Notiflix.Block.Merge({svgSize:'20px',});
    Notiflix.Block.Dots(`.toggle-status-${user.id}`);

    Notiflix.Confirm.Show('Change Status?', "Are you sure you want to change status?", 'Yes', 'No', () => {
      this.toggleStstuSubScr = this.userService.toggleStatus(`admin/${this.type}`, user).pipe(mergeMap(res=>{
        return this.loadUser(res);
    })).subscribe(res=>{
      Notiflix.Block.Remove(`.toggle-status-${user.id}`);
      Notiflix.Notify.Success(res.message);
    }, err=>{
      Notiflix.Block.Remove(`.toggle-status-${user.id}`);
    });

    }, () => {
      Notiflix.Block.Remove(`.toggle-status-${user.id}`);
    } )
  }

  deleteUser(user: User){
    Notiflix.Block.Merge({svgSize:'20px',});
    Notiflix.Block.Dots(`.delete-user-${user.id}`);

    Notiflix.Confirm.Show('Delete?', "Are you sure you want to delete?", 'Yes', 'No', () => {
      this.toggleStstuSubScr = this.userService.deleteUser(`admin/${this.type}`, user).pipe(mergeMap(res=>{
        return this.loadUser(res);
    })).subscribe(res=>{
      Notiflix.Block.Remove(`.delete-user-${user.id}`);
      Notiflix.Notify.Success(res.message);
    }, err=>{
      Notiflix.Block.Remove(`.delete-user-${user.id}`);
    });

    }, () => {
      Notiflix.Block.Remove(`.delete-user-${user.id}`);
    } )


  }

  details(user:User=null){
    const activeModal = this._modalService.open(DetailsComponent,{ size: 'lg'});


    activeModal.componentInstance.user = user;

    this.delRefreshUserSubScr = activeModal.componentInstance.loadUser.pipe(mergeMap(res =>{
      return this.loadUser()
    })).subscribe(res=>{
      activeModal.close();
    });
  }

  loadUser(ret:any=null, page:number = 1){
    let parm: string;
    if(this.searchFrm.controls.q.value){
      parm = `q=${(this.searchFrm.controls.q.value) ? this.searchFrm.controls.q.value : ''}`
    }

    return this.userService.getAllUser(`admin/${this.type}`,page, parm).pipe(map(users=>{
      if(ret)
        return ret;
      else
        return users;
    }))
  }

  search(event = null){
    Notiflix.Block.Dots(`.table`);
    this.searchSubScription = this.loadUser(null, event).subscribe(res=>{
      Notiflix.Block.Remove(`.table`);
    }, err=>{
      Notiflix.Block.Remove(`.table`);
    });
  }

  resetSearch(){
    this.searchFrm.controls.q.setValue(null);
    this.search();
  }
  ngOnInit(): void {
    this.pageTitle = this.route.snapshot.data['users']?.pageTitle;
    this.type = this.route.snapshot.data['users']?.type;
    this.users$ = this.userService.users;

    this.searchFrm = this.formBuilder.group({
      q: [null, []]
    });
  }

  ngOnDestroy(){
    if(this.toggleStstuSubScr){
      this.toggleStstuSubScr.unsubscribe();
    }

    if(this.delRefreshUserSubScr){
      this.delRefreshUserSubScr.unsubscribe();
    }

    if(this.searchSubScription){
      this.searchSubScription.unsubscribe();
    }
  }
}
