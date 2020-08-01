import { Product } from './crude/product';
import { Category } from '../category/crude/category';
import { Author } from '../author/crude/author';
import { Currency } from '../currency/crude/currency';
import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { ActivatedRoute,Router } from '@angular/router';
import { ProductService } from './crude/product.service';

import { ImageCroppedEvent } from 'ngx-image-cropper';


@Component({
  templateUrl: 'addproduct.component.html'
})
export class AddProductComponent  implements OnInit  {

  id: number;
  product: Product = new Product();
  submitted = false;
  categorys: Observable<Category[]>;
  authors: Observable<Author[]>;
  currencys: Observable<Currency[]>;
  subcategorys: Observable<Category[]>;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  flag: number = 0;

  constructor(private route: ActivatedRoute,private productService: ProductService,
    private router: Router) { }

   reloadData() {
    this.categorys = this.productService.getCategorys();
    this.authors = this.productService.getAuthors();
    this.currencys = this.productService.getCurrencys();
  }
   

  onOptionsSelected(value:number){
    console.log("the selected value is " + value);
    this.subcategorys = this.productService.getSubCategorys(value);
  }


  ngOnInit() {
    this.reloadData();
    this.product = new Product();
    this.id = this.route.snapshot.params['id'];
    this.productService.getProduct(this.id)
      .subscribe(data => {
        console.log("call-----------"+data);
        this.product = data;
        this.subcategorys = this.productService.getSubCategorys(data.categoryId);
      }, error => console.log(error));

  


      if(this.product){
        this.product.categoryId = 0;
        this.product.subCategoryId = 0;
        this.product.currencyId = 0;
        this.product.authorId = 0;
      }

  }

  newCategory(): void {
    this.submitted = false;
    this.product = new Product();
  }
 
  save() {
    this.productService.createProduct(this.product)
      .subscribe(data => console.log(data), error => console.log(error));
    this.product = new Product();
    this.gotoList();
  }

  onSubmit() {
    this.submitted = true;
    this.save();    
  }

  gotoList() {
    this.router.navigate(['/product']);
  }


  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
}
imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log(this.croppedImage);
    this.product.productImage = this.croppedImage;
}
imageLoaded() {
    this.flag = 1;
}
cropperReady() {
    /* cropper ready */
}
loadImageFailed() {
    /* show message */
}

}
