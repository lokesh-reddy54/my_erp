import { Injectable, NgModule } from "@angular/core";
import { Observable } from "rxjs";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

@Injectable()
export class HttpsRequestInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log("interceptingg.....");

    let headers = {};
    headers["Content-Type"] = "application/json";
    headers["username"] = "sam";

    let authToken = localStorage.getItem("authToken");
    let user = JSON.parse(localStorage.getItem("currentUser"));
    if (authToken) {
      headers["Authorization"] = "Bearer " + authToken;

      if (user) {
        headers["username"] = user["username"];
        headers["companyId"] = user.company_id + "";
      }
    }

    const dupReq = req.clone({
      setHeaders: headers,
    });
    return next.handle(dupReq);
  }
}

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpsRequestInterceptor,
      multi: true,
    },
  ],
})
export class InterceptorModule {}
