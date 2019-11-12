import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidatorsService } from 'src/app/services/validators.service';

@Component({
  selector: 'app-data-driven',
  templateUrl: './data-driven.component.html',
  styleUrls: ['./data-driven.component.css']
})
export class DataDrivenComponent implements OnInit {

  myFormList: FormGroup;
  myForm: FormGroup;

  states = [
    {nome: 'Rio de Janeiro', sigla: 'RJ'},
    {nome: 'São Paulo', sigla: 'SP'},
    {nome: 'Paraná', sigla: 'PR'},
    {nome: 'Minas Gerais', sigla: 'MG'}
  ]

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private validatorsService: ValidatorsService
  ) { }

  ngOnInit() {
    /*this.myForm = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null)
    });*/

    const fb = this.formBuilder;

    this.myFormList = fb.group({
      fruits: fb.array([this.createFruit()])
    })

    this.myForm = fb.group({
      informacoes: fb.group({
        nome: [null, [Validators.required, Validators.minLength(4), this.validatorsService.nameValidation], [this.validatorsService.userValidation.bind(this.validatorsService)] ],
        idade: [null],
        email: [null, [Validators.required, Validators.email] ],
        confirmarEmail: [null],
        empregado: [null, [Validators.pattern('true')] ],
        sexo: ['M']
      }),
      endereco: fb.group({
        cep: [null],
        logradouro: [null],
        numero: [null],
        complemento: [null],
        bairro: [null],
        localidade: [null],
        uf: [null]
      })
    });
  }

  getAddress() {
    this.http.get(`http://viacep.com.br/ws/${this.myForm.get('endereco.cep').value}/json/`)
      .subscribe(
        endereco => {
          this.myForm.patchValue({endereco});
        }
      );
  }

  compareStates(obj1, obj2) {
    if (obj1 && obj2) {
      return obj1.sigla === obj2.sigla
    }
    return false;
  }

  onSubmit() {
    console.log(this.myForm);
  }

  createFruit() {
    return this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(4)] ],
      price: [null, [Validators.required] ]
    })
  }

  addFruit() {
    const fruits = this.myFormList.get('fruits') as FormArray;
    fruits.push(this.createFruit());
  }

  removeFruit(index) {
    const fruits = this.myFormList.get('fruits') as FormArray;
    fruits.removeAt(index);
  }

}
