import { Component, OnInit } from '@angular/core';
import { GeneralService, UserService } from 'src/app/lib/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { User } from 'src/app/lib/interfaces';
import { Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import Notiflix from "notiflix";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  loggedUser$: Observable<User>;
  editProfileFrm: FormGroup;


  changePassCheckSubScr: Subscription;
  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private generalService: GeneralService) { }

    get f() { return this.editProfileFrm.controls; }
  ngOnInit(): void {

    this.generalService.bc$.next({
      siteName: environment.siteName,
      title: 'Edit My Profile',
      url:'',
      backUrl: null
    });

    this.editProfileFrm = this.formBuilder.group({
      fname: [null, [ Validators.required]],
      lname:[null, []],
      email: [{value: null, disabled: true}, [Validators.required]],
      phone: [{ value: null, disabled: true}, [Validators.required]],
      password: [{ value: null, disabled: true}, [Validators.required]],
      password_confirmation: [{ value: null, disabled: true}, [Validators.required]],
      isChanegPassword: [false, []]
    });



    this.changePassCheckSubScr = this.f.isChanegPassword.valueChanges.subscribe(res=>{
      if(res){
        this.f.password.enable();
        this.f.password_confirmation.enable();
      }else{
        this.f.password.disable();
        this.f.password_confirmation.disable();
      }

    })

    this.loggedUser$ = this.userService.getloggedUser.pipe(map(res=>{
      this.editProfileFrm.patchValue({
        fname: res?.fname,
        lname: res?.lname,
        phone: res?.phone,
        email: res?.email,
      });
      return res;
    }));
  }

  onFileInput(files: FileList){
    Notiflix.Block.Merge({svgSize:'20px',});
    Notiflix.Block.Dots(`.avatar-img`);


    const formData = new FormData();
    formData.append('avatharImg', files.item(0));
    //avatar-img
    this.userService.updateAvatar(formData).pipe(mergeMap(()=>{
      return this.userService.authUser();
    })).subscribe(()=>{
      Notiflix.Notify.Success(`Successfully changed avathar `);
      Notiflix.Block.Remove(`.avatar-img`);
    }, ()=>{
      Notiflix.Notify.Failure(`Sorry image can't be uploaded `);
      Notiflix.Block.Remove(`.avatar-img`);
    });
  }
  updateProfile(){
    Notiflix.Loading.Pulse(`${(this.f.fname.value) ? this.f.fname.value : ''} please wait`);
    const postData = {
      fname: this.f.fname.value,
      lname: this.f.lname.value,
      email:  this.f.email.value,
      password: null,
      password_confirmation: null,
      isChanegPassword:false
    }
    if(this.f.isChanegPassword.value){
      postData.password = this.f.password.value;
      postData.password_confirmation = this.f.password_confirmation.value;
      postData.isChanegPassword =true;
    }
    this.userService.updateProfile(postData).pipe(mergeMap(res=>{
      return this.userService.authUser().pipe(map(()=> res));
    })).subscribe(()=>{
      Notiflix.Loading.Remove();
      Notiflix.Notify.Success(`Successfully updated `);

      this.editProfileFrm.patchValue({
        isChanegPassword: false,
        password: null,
        password_confirmation: null
      });
    }, error=>{
      for(let result in this.editProfileFrm.controls){
        if(error.error.errors[result]){
          this.editProfileFrm.controls[result].setErrors({ error: error.error.errors[result] });
        }else{
          this.editProfileFrm.controls[result].setErrors(null);
        }
      }
      Notiflix.Loading.Remove();
    })

  }
  ngOnDestroy(){
    if(this.changePassCheckSubScr){
      this.changePassCheckSubScr.unsubscribe();
    }

  }

}
