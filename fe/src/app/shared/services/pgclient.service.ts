import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import * as _ from "lodash";

declare var $: any;
declare var document: any;
declare var CashFree: any;
declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class PgClientService {

  private scriptsStore: Array<any> = [
    { name: 'CashFree', src: 'https://www.cashfree.com/assets/cashfree.sdk.v1.2.js' },
    { name: 'RazorPay', src: 'https://checkout.razorpay.com/v1/checkout.js' }
  ];

  private cashFreePaymentModes: any = {
    'CREDIT_CARD': 'CreditCard',
    'DEBIT_CARD': 'DebitCard',
    'NET_BANKING': 'NetBanking'
  }

  private scripts: any = {};
  private inputData: any;
  private mode: string;
  private backendUrl: string;

  private _transaction: any;

  constructor(private http: HttpClient) {
    this.scriptsStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });

  }

  public initialize(mode: string, backendUrl: string) {
    this.mode = mode;
    this.backendUrl = backendUrl;
  }

  /**
   *	Input Data params:
   *		orderId
   *		businessId
   *		businessType,
   *		isPreAuth (optional),
   *		currency,
   *		amount,
   *	  merchant {
    name,
    image
   *	  },
   *		customer {
    firstName,
    lastName,
    phoneCountryCode,
    phone,
    email
     *		},
   *		additionalData (optional)
   */
  public makePaymentRequest(inputData: any) {
    this.inputData = _.clone(inputData);
    if (!environment.production) {
      inputData.amount = 1
    }
    var self = this;
    return new Promise((function(resolve, reject) {
      this.http.post(this.backendUrl + 'internal/pg/transaction', inputData).subscribe(
        res => {

          if (res['error']) {
            reject(res['error']);
          } else {
            this._transaction = res['data']

            inputData['orderId'] = 'PGTR_' + this._transaction['id'];
            inputData['pgSystemId'] = this._transaction['pgSystemId'];
            inputData['pgCharge'] = this._transaction['pgCharge'];

            if (this._transaction['pgProvider'] == 'CashFree') {

              this.load('CashFree')
                .then((function(data) {
                  console.log('script loaded ', data);
                  this.initializeCashFree()
                    .then((function() {
                      this.callCashFree(inputData, function(pgResult) {
                        if (pgResult['status'] == 'ERROR') {
                          reject(pgResult);
                        } else {
                          resolve(pgResult);
                        }
                      });
                    }).bind(this))
                    .catch(function(errorMsg) {
                      reject({
                        status: 'ERROR',
                        message: errorMsg
                      });
                    })
                }).bind(this))
                .catch(function(errorMsg) {
                  reject({
                    status: 'ERROR',
                    message: errorMsg
                  });
                });
            } else if (this._transaction['pgProvider'] == 'RazorPay') {
              this.load('RazorPay')
                .then((function(data) {
                  console.log('script loaded ', data);
                  this.callRazorPay(inputData, function(pgResult) {
                    if (pgResult['status'] == 'ERROR') {
                      reject(pgResult);
                    } else {
                      resolve(pgResult);
                    }
                  })
                }).bind(this))
                .catch(function(errorMsg) {
                  reject({
                    status: 'ERROR',
                    message: errorMsg
                  });
                });
            } else {
              reject({
                status: 'ERROR',
                message: 'Invalid PG provider'
              });
            }
          }
        },
        error => {
          reject(error);
        }
      )
    }).bind(this));
  }

  private storeRequest(request: any) {
    this.http.post(this.backendUrl + 'internal/pg/transaction/' + this._transaction['id'] + '/request', request).subscribe(
      res => { },
      error => {
        console.log(error);
      }
    );
  }

  private storeResponse(response: any) {
    this.http.post(this.backendUrl + 'internal/pg/transaction/' + this._transaction['id'] + '/response', response).subscribe(
      res => { },
      error => {
        console.log(error);
      }
    );
  }

  private changeTransactionStatus(status: string) {
    return this.http.post(this.backendUrl + 'internal/pg/transaction/' + this._transaction['id'] + '/status', { status: status });
  }

  private updateTransactionInfo() {
    return this.http.post(this.backendUrl + 'internal/pg/transaction/' + this._transaction['id'] + '/update', this._transaction);
  }

  private cancelTransaction() {
    return this.http.post(this.backendUrl + 'internal/pg/transaction/' + this._transaction['id'] + '/cancel', {});
  }

  public get transaction() {
    return this._transaction;
  }

  private initializeCashFree() {
    let config = {
      layout: {
        view: 'popup',
        width: 650
      },
      mode: this.mode
    }

    this.storeRequest({ postData: JSON.stringify(config) });

    let response = CashFree.init(config);
    console.log(JSON.stringify(response, null, 2));

    this.storeResponse({ response: JSON.stringify(response) });

    if (response['status'] == 'OK') {
      return Promise.resolve();
    } else {
      return Promise.reject(response['message']);
    }
  }

  private callCashFree(inputData: any, callback) {

    this.http.post(this.backendUrl + 'internal/pg/cashfree/checksum', {
      orderId: inputData['orderId'],
      amount: inputData['amount'],
      pgSystemId: inputData['pgSystemId']
    }).subscribe(
      res => {
        if (!res['error']) {
          let appId = res['data']['appId'];
          let token = res['data']['token'];

          let data = {
            orderId: inputData['orderId'],
            orderAmount: inputData['amount'],
            orderCurrency: inputData['currency'],
            customerName: inputData['customer']['firstName'] + ' ' + inputData['customer']['lastName'],
            customerPhone: inputData['customer']['phoneCountryCode'] + inputData['customer']['phone'],
            customerEmail: inputData['customer']['email'],
            //returnUrl: '',
            //notifyUrl: '',
            appId: appId,
            paymentToken: token
          };

          console.log(JSON.stringify(data, null, 2));

          this.storeRequest({ postData: JSON.stringify(data) });

          CashFree.makePayment(data, (function(event) {

            console.log(JSON.stringify(event, null, 2));

            this.storeResponse({ response: JSON.stringify(event) });

            if (event['name'] == 'PAYMENT_INIT' || event['name'] == 'PAYMENT_REQUEST') {
              if (event['status'] == 'ERROR') {
                callback({
                  status: 'ERROR',
                  transaction: this._transaction,
                  message: event['message']
                })
              }
            } else if (event['name'] == 'PAYMENT_RESPONSE') {

              if (event['response']['txStatus'] == 'SUCCESS') {

                this._transaction['status'] = 'SUCCESSFUL';
                this._transaction['pgTransactionId'] = event['response']['referenceId'];
                this._transaction['paymentMode'] = this.cashFreePaymentModes[event['response']['paymentMode']];

                this.updateTransactionInfo().subscribe(
                  res => {
                    callback({
                      status: 'SUCCESSFUL',
                      transaction: this._transaction
                    });
                  },
                  error => {
                    console.log(error);
                  }
                )

                var data = {
                  bookingId: inputData.bookingId,
                  amount: this.inputData.amount,
                  pgCharge: inputData.pgCharge
                }
                this.http.post(this.backendUrl + 'internal/pg/storePgPayment', data).subscribe(
                  res => {
                    console.log("PGClient Service ::: store pg payemnt : ", res['data']);
                  })
              } else if (event['response']['txStatus'] == 'FAILED') {
                this.changeTransactionStatus('FAILED').subscribe(
                  res => {
                    callback({
                      status: 'FAILED',
                      transaction: this._transaction
                    });
                  },
                  error => {
                    console.log(error);
                  }
                );
              } else if (event['response']['txStatus'] == 'ERROR') {
                callback({
                  status: 'ERROR',
                  transaction: this._transaction,
                  message: event['response']['txMsg']
                })
              } else if (event['response']['txStatus'] == 'CANCELLED') {
                this.cancelTransaction().subscribe(
                  res => {
                    callback({
                      status: 'CANCELLED',
                      transaction: this._transaction,
                    })
                  },
                  error => {
                    console.log(error);
                  }
                );
              } else {
                callback({
                  status: 'UNKNOWN',
                  transaction: this._transaction
                })
              }
            }
          }).bind(this));
        } else {
          console.log(res['error']);
          callback({
            status: 'ERROR',
            message: res['error']
          })
        }
      },
      error => {
        console.log(error);
        callback({
          status: 'ERROR',
          message: error
        })
      }
    );
  }

  private callRazorPay(inputData: any, callback) {
    console.log("in callRazorPay :: inputdata : ", {
      orderId: inputData['orderId'],
      amount: inputData['amount'],
      currency: inputData['currency'],
      pgSystemId: inputData['pgSystemId']
    });
    this.http.post(this.backendUrl + 'internal/pg/razorpay/createorder/' + this._transaction['transaction_id'], {
      orderId: inputData['orderId'],
      amount: inputData['amount'],
      currency: inputData['currency'],
      pgSystemId: inputData['pgSystemId']
    }).subscribe(
      res => {
        if (!res['error']) {
          let orderId = res['data']['orderId'];
          let key = res['data']['keyId'];

          var options = {
            "key": key,
            "amount": (inputData['amount'] * 100),
            "name": inputData['merchant']['name'],
            description: inputData['orderId'],
            image: inputData['merchant']['image'],
            "handler": (function(response) {

              console.log(JSON.stringify(response, null, 2));

              this._transaction['status'] = 'SUCCESSFUL';
              this._transaction['pg_transaction_id'] = response['razorpay_payment_id'];

              this.updateTransactionInfo().subscribe(
                res => {
                  callback({
                    status: 'SUCCESSFUL',
                    transaction: this._transaction
                  });
                },
                error => {
                  console.log(error);
                }
              )
            }).bind(this),
            modal: {
              ondismiss: (function() {
                console.log('on dismiss');
                this.cancelTransaction().subscribe(
                  res => {
                    callback({
                      status: 'CANCELLED',
                      transaction: this._transaction,
                    })
                  },
                  error => {
                    console.log(error);
                  }
                );
              }).bind(this)
            },
            prefill: {
              email: inputData['customer']['email'],
              contact: inputData['customer']['phoneCountryCode'] + inputData['customer']['phone'],
              name: inputData['customer']['firstName'] + ' ' + inputData['customer']['lastName']
            },
            //"theme": {
            //  "color": "#76396E"
            //},
            //method: $scope.paymentModes,
            order_id: orderId
          };
          var rzp1 = new Razorpay(options);

          rzp1.open();
        } else {
          console.log(res['error']);
          callback({
            status: 'ERROR',
            message: res['error']
          })
        }
      },
      error => {
        console.log(error);
        callback({
          status: 'ERROR',
          message: error
        })
      }
    );
  }

  private load(...scripts: string[]) {
    var promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  private loadScript(name: string) {
    return new Promise((resolve, reject) => {
      //resolve if already loaded
      if (this.scripts[name].loaded) {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      }
      else {
        //load script
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        if (script.readyState) {  //IE
          script.onreadystatechange = () => {
            if (script.readyState === "loaded" || script.readyState === "complete") {
              script.onreadystatechange = null;
              this.scripts[name].loaded = true;
              resolve({ script: name, loaded: true, status: 'Loaded' });
            }
          };
        } else {  //Others
          script.onload = () => {
            this.scripts[name].loaded = true;
            resolve({ script: name, loaded: true, status: 'Loaded' });
          };
        }
        script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }

}
