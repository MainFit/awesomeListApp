import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { WorkdaysService } from 'src/app/core/services/workdays.service';
import { User } from 'src/app/shared/models/user';
import { Workday } from 'src/app/shared/models/workday';

@Component({
  selector: 'al-workday-form',
  templateUrl: './workday-form.component.html',
  styles: [
  ]
})
export class WorkdayFormComponent implements OnInit {
  workdayId: string;
  workdayForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private workdaysService: WorkdaysService,
    private authService: AuthService,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
  this.route.queryParams.subscribe(params => {
   this.workdayId = '';
   this.workdayForm = this.createWorkdayForm();
   if(params['date']) {
    const date: Date = new Date (+params['date']* 1000);
    this.dueDate.setValue(date);
   }
  });
  }


  get dueDate() { return this.workdayForm.get('dueDate') as FormControl; }
  get notes() { return this.workdayForm.get('notes') as FormControl; }
  get tasks() { return this.workdayForm.get('tasks') as FormArray; }

  createWorkdayForm(): FormGroup {
    const workdayForm: FormGroup = this.fb.group({
      dueDate: ['', [
      Validators.required
     ]],
     tasks: this.fb.array([], [
      Validators.required,
      Validators.maxLength(6)
     ]),
     notes: ['', [
      Validators.maxLength(1000)
     ]]
   });

   return workdayForm;
  }

  resetWorkdayForm() {
    while(this.tasks.length !== 0) {
     this.tasks.removeAt(0);
    }
    this.notes.reset();
   }
   /*
   onDateSelected(displayDate: string) {
    this.workdaysService.getWorkdayByDate(displayDate).subscribe(workday => {
     this.resetWorkdayForm();
     if(!workday) return;
     this.workdayId = workday.id;
     this.notes.setValue(workday.notes);
     workday.tasks.forEach(task => {
      const taskField: FormGroup = this.fb.group({
       title: task.title,
       todo: task.todo,
       done: task.done
      });
      this.tasks.push(taskField);
     });
    });
   }*/

  // Version sans l'erreur
  onDateSelected(displayDate: string) {
  const user: User|null = this.authService.currentUser;

  if(user && user.id) {
   this.workdaysService.getWorkdayByDate(displayDate, user.id).subscribe(workday => {
    this.resetWorkdayForm();
    if(!workday) return;

    this.workdayId = workday.id as string;
    this.notes.setValue(workday.notes);
    workday.tasks.forEach(task => {
     const taskField: FormGroup = this.fb.group({
      title: task.title,
      todo: task.todo,
      done: task.done
     });
     this.tasks.push(taskField);
    });
   });
  }
 }

 submit(): void {
  const user: User|null = this.authService.currentUser;

  if(!(user && user.id)) {
   return;
  }

  // Update workday
  if(this.workdayId) {
   const workdayToUpdate: Workday = new Workday({...this.workdayForm.value, userId: user.id, id: this.workdayId });

   this.workdaysService.update(workdayToUpdate).subscribe({
      next: () => this.router.navigate(['/app/planning']),
      error: () => this.workdayForm.reset()
    });
   return;
  }

  // Create workday
  const workdayToCreate = new Workday({...this.workdayForm.value, userId: user.id});
  this.workdaysService.save(workdayToCreate).subscribe({
    next: () => this.router.navigate(['/app/planning']),
    error: () => this.workdayForm.reset()
  });
 }
}