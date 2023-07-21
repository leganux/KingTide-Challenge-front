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

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  //fields

  name: string = ''
  update: string = ''
  last_name: string = ''
  sur_name: string = ''
  rfc: string = ''
  birthday: string = ''
  photo: string = ''
  cv: string = ''
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
        this.titleNewUpdate = 'Nuevo Usuario'
        this.update = ''
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
        this.apiService.deleteUser(item.id).subscribe(
          (data: any) => {
            this.getUsers()
            this.titleNewUpdate = 'Nuevo Usuario'
            this.update = ''
            $('#name').val('')
            $('#last_name').val('')
            $('#sur_name').val('')
            $('#rfc').val('')
            $('#birthday').val('')
            $('#photo').val('')
            this.Toast.fire({
              icon: 'success',
              title: 'Eliminado con exito'
            })
          },
          (error) => {
            console.error('Error:', error);
          }
        );
      }
    })
  }

  updateUser(item: any) {
    this.update = item.id
    this.photo = item.profilePicture
    this.name = item.name
    this.last_name = item.lastName
    this.sur_name = item.surName
    this.rfc = item.rfc
    this.birthday = moment(item.birthday).format('YYYY-MM-DD')
    this.selectedFile = {}
    this.titleNewUpdate = 'Editar Usuario'
  }

  async uploadCV(item: any) {

    const {value: file} = await Swal.fire({
      title: 'Selecciona el CV del usuario',
      input: 'file',
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#212121',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Subir Archivo',
      cancelButtonText: 'Cancelar',
      inputAttributes: {
        'accept': '.pdf, .doc, .docx',
        'aria-label': 'Selecciona el CV del usuario'
      }
    })
    if (file) {
      console.log(file)
      this.apiService.uploadFile(file).subscribe(
        (data: any) => {
          this.cv = data.data.location
          let body = {
            file: this.cv,
            user_id: item.id,
          }

          this.apiService.createFile(body).subscribe(
            (data: any) => {

              $('#name').val('')
              $('#last_name').val('')
              $('#sur_name').val('')
              $('#rfc').val('')
              $('#birthday').val('')
              $('#photo').val('')
              this.update = ''
              this.titleNewUpdate = 'Nuevo Usuario'
              item.cv = data.data[0].id
              let id = item.id
              delete item.created_at
              delete item.updated_at
              delete item.id
              this.apiService.updateUser(id, item).subscribe(
                (data: any) => {
                  this.getUsers()
                  this.Toast.fire({
                    icon: 'success',
                    title: 'Guardado con exito'
                  })
                },
                (error) => {
                  console.error('Error:', error);
                }
              );


            },
            (error) => {
              console.error('Error:', error);
            }
          );

          this.Toast.fire({
            icon: 'success',
            title: 'Guardado con exito'
          })

        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }


  }

  viewCV(item: any) {

    this.apiService.getFile(item.cv).subscribe(
      (data: any) => {
        let file = data.data[0].file
        if (file?.toLowerCase()?.includes('.pdf')) {
          Swal.fire({
            title: 'PDF',

            html: ` <div width="100%" class="embed-responsive embed-responsive-16by9">
            <iframe height="500px" width="100%" class="embed-responsive-item" src="${file}" allowfullscreen></iframe>
            </div> `,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText:
              'ok',
            confirmButtonAriaLabel: 'OK',
            width: '80%',
            heightAuto: true


          })
        } else {
          window.open(file)
        }


      },
      (error) => {
        console.error('Error:', error);
        this.Toast.fire({
          icon: 'error',
          title: 'Archivo no disponible'
        })
      }
    );

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
          profilePicture: this.photo,
        }
        let ok = true
        for (let [key, val] of Object.entries(body)) {
          if (!val || val == '') {
            ok = false
          }

        }
        if (!ok) {
          this.Toast.fire({
            icon: 'error',
            title: 'Verifique que ha llenado todos los campos'
          })
          return
        }

        if (this.update == '') {
          this.apiService.createUser(body).subscribe(
            (data: any) => {
              this.getUsers()
              this.update = ''
              this.titleNewUpdate = 'Nuevo Usuario'
              $('#name').val('')
              $('#last_name').val('')
              $('#sur_name').val('')
              $('#rfc').val('')
              $('#birthday').val('')
              $('#photo').val('')
              this.Toast.fire({
                icon: 'success',
                title: 'Guardado con exito'
              })
            },
            (error) => {
              console.error('Error:', error);
            }
          );
        } else {
          this.apiService.updateUser(this.update, body).subscribe(
            (data: any) => {
              this.update = ''
              this.titleNewUpdate = 'Nuevo Usuario'
              this.getUsers()
              $('#name').val('')
              $('#last_name').val('')
              $('#sur_name').val('')
              $('#rfc').val('')
              $('#birthday').val('')
              $('#photo').val('')
              this.Toast.fire({
                icon: 'success',
                title: 'Guardado con exito'
              })
            },
            (error) => {
              console.error('Error:', error);
            }
          );
        }

      }
    })


  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.apiService.uploadPhoto(this.selectedFile).subscribe(
      (data: any) => {
        this.photo = data.data.location
        console.log('PHOTO', this.photo)
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
