import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError, finalize } from 'rxjs';
import { LocalStorage, Mensagem } from 'src/utils/constrains';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class RequestInterceptor implements HttpInterceptor {

    totalRequests = 0;
    completedRequests = 0;

    constructor(
        private router: Router,
        // private toastr: ToastrService,
        private loader: LoadingService
        ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //   this.spinner.show(undefined,
    //       {
    //           type: 'ball-clip-rotate',
    //           size: 'medium',
    //           bdColor: 'rgba(0,0,0,0.70)',
    //           color: 'white',
    //           fullScreen: true
    //       }
    //   );


      let token = localStorage.getItem(LocalStorage.token);

      if (token) {
          request = request.clone({
              setHeaders: {
                  ContentType: 'application/json',
                  'Access-Control-Allow-Headers': 'Content-Type',
                  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                  'Access-Control-Allow-Origin': '*',
                  Authorization: `Bearer ${token}`
              }
          });
      } else {
          request = request.clone({
              setHeaders: {
                  ContentType: 'application/json',
                  'Access-Control-Allow-Headers': 'Content-Type',
                  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                  'Access-Control-Allow-Origin': '*'
              }
          });
      }
      this.loader.show()
      return next.handle(request).pipe(

          catchError((error: HttpErrorResponse) => {
              if (error.status === 401) {
                  localStorage.clear();
                  sessionStorage.clear();
                //   this.toastr.error(Mensagem.mensagemDesconect);
                  this.router.navigate(['login']);
              }
            //   else if (error.status === 403) {
            //     //   this.toastr.error(Mensagem.usuarioSemPermissao);
            //   }
            //   else {
            //     //   this.toastr.error(Mensagem.erroGenerico);
            //   }

              return throwError(error);
          }),
        finalize(() => { this.loader.hide(); })
      );
    }
}
