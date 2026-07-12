import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './setting.html'
})
export class SettingComponent {

  model = {
    webName: '',
    motto: '',
    themeColor: ''
  };

  colors = [
    { text: 'Blue', value: 'blue' },
    { text: 'Green', value: 'green' },
    { text: 'Red', value: 'red' },
    { text: 'Yellow', value: 'yellow' },
    { text: 'Orange', value: 'orange' }
  ];

  onSave() {
    console.log('Saved:', this.model);
    // call API here
  }
}