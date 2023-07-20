import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {HttpClient} from '@angular/common/http';
import Swal from 'sweetalert2';


declare var $: any;
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  titleNewUpdate: string = 'Nuevo Usuario'
  listOfUsers: any = []

  //fields

  name: string = ''
  last_name: string = ''
  sur_name: string = ''
  rfc: string = ''
  birthday: string = ''
  photo: string = ''
  selectedFile: any = {}

  constructor(private apiService: ApiService) {
  }

  clearForm() {
    Swal.fire({
      title: 'Estas seguro?',
      text: "Se limpiaran todos los campos y podrias perder tu información",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#212121',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        $('#name').val('')
        $('#last_name').val('')
        $('#sur_name').val('')
        $('#rfc').val('')
        $('#birthday').val('')
        $('#photo').val('')
      }
    })

  }

  deleteUser(item: any) {
    Swal.fire({
      title: 'Estas seguro?',
      text: "Esta accion no tiene retorno",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#212121',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        
      }
    })
  }

  updateUser(item: any) {
  }

  uploadCV(item: any) {
  }

  viewCV(item: any) {
  }

  saveForm() {

    Swal.fire({
      title: 'Estas seguro que desae guardar los cambios?',
      text: "Se creara un nuevo usuario",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#212121',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      if (result.isConfirmed) {
        let body: any = {
          name: this.name,
          lastName: this.last_name,
          surName: this.sur_name,
          rfc: this.rfc,
          birthday: moment(this.birthday).startOf('day').format(),
          photography: this.photo,
        }

        this.apiService.createUser(body).subscribe(
          (data: any) => {
            this.getUsers()
            $('#name').val('')
            $('#last_name').val('')
            $('#sur_name').val('')
            $('#rfc').val('')
            $('#birthday').val('')
            $('#photo').val('')
          },
          (error) => {
            console.error('Error:', error);
          }
        );
      }
    })


  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.apiService.uploadPhoto(this.selectedFile).subscribe(
      (data: any) => {
        this.photo = data.data.location
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }


  getUsers() {
    this.apiService.getUsers().subscribe(
      (data: any) => {
        this.listOfUsers = data.data;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  ngOnInit() {
    const currentDate = moment().format('YYYY-MM-DD');
    console.log('Current Date:', currentDate);

    this.getUsers()

  }
}
