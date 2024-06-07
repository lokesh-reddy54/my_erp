import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpHeaders } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { Helpers } from "../../helpers";

import * as _ from "lodash";

declare let $: any;
@Injectable()
export class AdminService {
  httpOptions;

  constructor(private httpClient: HttpClient) {
    if (
      localStorage.getItem("cwo_user") &&
      localStorage.getItem("cwo_user") != ""
    ) {
      var user = JSON.parse(localStorage.getItem("cwo_user"));
      var companyId = user && user.companyId ? user.companyId : 1;
      var headers = {
        "Content-Type": "application/json",
        companyid: companyId + "",
      };
      if (user && user.token) {
        headers["Authorization"] = user.token;
      }
      this.httpOptions = {
        headers: new HttpHeaders(headers),
      };
    } else {
      this.httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        }),
      };
    }
  }

  listCompanies(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listCompanies", data, Helpers.rheaders() );
  }
  saveCompany(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveCompany", data, Helpers.rheaders() );
  }
  saveCompanyContact(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveCompanyContact", data, Helpers.rheaders() );
  }
  savePettyCashAccountUser(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/savePettyCashAccountUser", data, Helpers.rheaders() );
  }
  savePettyCashAccount(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/savePettyCashAccount", data, Helpers.rheaders() );
  }
  listPettyCashAccounts(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listPettyCashAccounts", data, Helpers.rheaders() );
  }
  saveDebitCardAccountUser(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveDebitCardAccountUser", data, Helpers.rheaders() );
  }
  saveDebitCardAccount(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveDebitCardAccount", data, Helpers.rheaders() );
  }
  listDebitCardAccounts(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listDebitCardAccounts", data, Helpers.rheaders() );
  }
  saveRole(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveRole", data, Helpers.rheaders() );
  }
  listRoles(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listRoles", data, Helpers.rheaders() );
  }
  saveHelpNote(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveHelpNote", data, Helpers.rheaders() );
  }
  deleteHelpNote(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/deleteHelpNote/" + id, Helpers.rheaders() );
  }
  helpNotes: any = [];
  listHelpNotes(data: any) {
    let observable: Observable<any> = new Observable((obs) => {
      console.log("helpnotes :: ", this.helpNotes);
      if (this.helpNotes.length == 0) {
        this.httpClient
          .post(
            Helpers.composeEnvUrl() + "internal/admin/listHelpNotes",
            data,
            Helpers.rheaders()
          )
          .subscribe((res) => {
            this.helpNotes = res["data"];
            obs.next({ data: this.helpNotes });
            obs.complete();
          });
      } else {
        obs.next({ data: this.helpNotes });
        obs.complete();
      }
    });
    return observable;
  }

  saveBusinessTerm(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveBusinessTerm", data, Helpers.rheaders() );
  }
  deleteBusinessTerm(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/deleteBusinessTerm/" + id, Helpers.rheaders() );
  }
  listBusinessTerms(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listBusinessTerms", data, Helpers.rheaders() );
  }
  listUsers(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listUsers", data, Helpers.rheaders() );
  }
  saveUser(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveUser", data, Helpers.rheaders() );
  }
  deleteUser(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/deleteUser/" + id, Helpers.rheaders() );
  }

  listCountries(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listCountries", data, Helpers.rheaders() );
  }
  saveCountry(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveCountry", data, Helpers.rheaders() );
  }
  deleteCountry(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/deleteCountry/" + id, Helpers.rheaders() );
  }

  getCitiesWithBuildings(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/getCitiesWithBuildings", data, Helpers.rheaders() );
  }
  listCities(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listCities", data, Helpers.rheaders() );
  }
  saveCity(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveCity", data, Helpers.rheaders() );
  }
  deleteCity(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/deleteCity/" + id, Helpers.rheaders() );
  }

  listLocations(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listLocations", data, Helpers.rheaders() );
  }
  saveLocation(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveLocation", data, Helpers.rheaders() );
  }
  deleteLocation(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/deleteLocation/" + id, Helpers.rheaders() );
  }

  listFacilitySets(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listFacilitySets", data, Helpers.rheaders() );
  }
  saveFacilitySet(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveFacilitySet", data, Helpers.rheaders() );
  }
  deleteFacilitySet(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/deleteFacilitySet/" + id, Helpers.rheaders() );
  }

  listFacilities(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listFacilities", data, Helpers.rheaders() );
  }
  saveFacility(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveFacility", data, Helpers.rheaders() );
  }
  deleteFacility(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/deleteFacility/" + id, Helpers.rheaders() );
  }
  updateFacilitySetFacilities(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/updateFacilitySetFacilities", data, Helpers.rheaders() );
  }

  searchOffices(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/searchOffices", data, Helpers.rheaders() );
  }
  listBuildings(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listBuildings", data, Helpers.rheaders() );
  }
  listBuildingProperties(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listBuildingProperties", data, Helpers.rheaders() );
  }
  listBuildingAmcs(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listBuildingAmcs", data, Helpers.rheaders() );
  }
  listBuildingAmcItems(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listBuildingAmcItems", data, Helpers.rheaders() );
  }
  listBuildingContacts(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listBuildingContacts", data, Helpers.rheaders() );
  }
  listPropertyContacts(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listPropertyContacts", data, Helpers.rheaders() );
  }
  listPropertyContractUpdates(data: any) {
    return this.httpClient.post( Helpers.composeEnvUrl() + "internal/admin/listPropertyContractNegotiations", data, Helpers.rheaders() );
  }
  listPropertyImages(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listPropertyImages", data, Helpers.rheaders() );
  }
  saveBuildingContact(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveBuildingContact", data, Helpers.rheaders() );
  }
  saveBuildingAmc(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveBuildingAmc", data, Helpers.rheaders() );
  }
  saveBuildingAmcItem(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveBuildingAmcItem", data, Helpers.rheaders() );
  }
  savePropertyContact(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/savePropertyContact", data, Helpers.rheaders() );
  }
  savePropertyContract(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/savePropertyContract", data, Helpers.rheaders() );
  }
  listPropertyContractNegotiations(data: any) {
    return this.httpClient.post( Helpers.composeEnvUrl() +  "internal/admin/listPropertyContractNegotiations", data, Helpers.rheaders() );
  }
  savePropertyContractNegotiation(data: any) {
    return this.httpClient.post( Helpers.composeEnvUrl() + "internal/admin/savePropertyContractNegotiation", data, Helpers.rheaders() );
  }
  saveBuildingContractUpdate(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveBuildingContractUpdate", data, Helpers.rheaders() );
  }
  getPropertyContract(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/getPropertyContract/" + id, Helpers.rheaders() );
  }
  getBuildingContract(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/getBuildingContract/" + id, Helpers.rheaders() );
  }
  getBuildingContractTerms(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/getBuildingContractTerms/" + id, Helpers.rheaders() );
  }
  saveBuildingProperty(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveBuildingProperty", data, Helpers.rheaders() );
  }
  saveBuildingContractTerm(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveBuildingContractTerm", data, Helpers.rheaders() );
  }
  saveBuilding(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveBuilding", data, Helpers.rheaders() );
  }
  saveBuildingService(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveBuildingService", data, Helpers.rheaders() );
  }
  saveBuildingServiceAssignee(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveBuildingServiceAssignee", data, Helpers.rheaders() );
  }
  getBuildingServices(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/getBuildingServices/" + id, Helpers.rheaders() );
  }
  deleteBuilding(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/deleteBuilding/" + id, Helpers.rheaders() );
  }
  listOffices(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listOffices", data, Helpers.rheaders() );
  }

  listParkingLots(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listParkingLots", data, Helpers.rheaders() );
  }
  saveOffice(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveOffice", data, Helpers.rheaders() );
  }
  deleteOffice(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/deleteOffice/" + id, Helpers.rheaders() );
  }

  listOfficePricings(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listOfficePricings", data, Helpers.rheaders() );
  }
  saveOfficePricing(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveOfficePricing", data, Helpers.rheaders() );
  }
  deleteOfficePricing(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/deleteOfficePricing/" + id, Helpers.rheaders() );
  }

  listFloors(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listFloors", data, Helpers.rheaders() );
  }
  saveFloor(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveFloor", data, Helpers.rheaders() );
  }
  deleteFloor(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/deleteFloor/" + id, Helpers.rheaders() );
  }

  listCabins(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listCabins", data, Helpers.rheaders() );
  }
  saveCabin(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveCabin", data, Helpers.rheaders() );
  }
  deleteCabin(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/deleteCabin/" + id, Helpers.rheaders() );
  }

  listDesks(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listDesks", data, Helpers.rheaders() );
  }
  saveDesk(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveDesk", data, Helpers.rheaders() );
  }
  deleteDesk(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/deleteDesk/" + id, Helpers.rheaders() );
  }
  saveParkingLot(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveParkingLot", data, Helpers.rheaders() );
  }
  saveParkingSpots(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveParkingSpots", data, Helpers.rheaders() );
  }
  listResources(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listResources", data, Helpers.rheaders() );
  }
  listResourceImages(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listResourceImages", data, Helpers.rheaders() );
  }
  saveResource(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveResource", data, Helpers.rheaders() );
  }
  deleteResource(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/deleteResource/" + id, Helpers.rheaders() );
  }

  listSkuCategories(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listSkuCategories", data, Helpers.rheaders() );
  }
  saveSkuCategory(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveSkuCategory", data, Helpers.rheaders() );
  }
  deleteSkuCategory(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/deleteSkuCategory/" + id, Helpers.rheaders() );
  }

  listSkus(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listSkus", data, Helpers.rheaders() );
  }
  saveSku(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveSku", data, Helpers.rheaders() );
  }
  deleteSku(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/deleteSku/" + id, Helpers.rheaders() );
  }

  listServiceProviderServices(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listServiceProviderServices", data, Helpers.rheaders() );
  }
  saveServiceProviderService(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveServiceProviderService", data, Helpers.rheaders() );
  }
  listServiceProviders(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listServiceProviders", data, Helpers.rheaders() );
  }
  saveServiceProvider(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveServiceProvider", data, Helpers.rheaders() );
  }

  listAssets(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listAssets", data, Helpers.rheaders() );
  }
  saveAsset(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveAsset", data, Helpers.rheaders() );
  }
  deleteAsset(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/deleteAsset/" + id, Helpers.rheaders() );
  }

  listExternalSystems(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listExternalSystems", data, Helpers.rheaders() );
  }
  saveExternalSystem(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveExternalSystem", data, Helpers.rheaders() );
  }
  deleteExternalSystem(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/deleteExternalSystem/" + id, Helpers.rheaders() );
  }

  listMails(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listMails", data, Helpers.rheaders() );
  }
  saveMail(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveMail", data, Helpers.rheaders() );
  }
  deleteMail(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/deleteMail/" + id, Helpers.rheaders() );
  }

  getNotification(id: any) {
    return this.httpClient.get(Helpers.composeEnvUrl() + "internal/admin/getNotification/" + id, Helpers.rheaders() );
  }
  listClients(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listClients", data, Helpers.rheaders() );
  }
  listNotifications(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/listNotifications", data, Helpers.rheaders() );
  }
  saveNotification(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/saveNotification", data,Helpers.rheaders());
  }
  publishNotification(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/admin/publishNotification", data, Helpers.rheaders() );
  }
  getUserMessages(data: any) {
    return this.httpClient.post( Helpers.composeEnvUrl() + "internal/admin/getUserMessages", data, Helpers.rheaders() );
  }

  raiseMonthlyInvoices(data: any) {
    return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/raiseInvoices", data, Helpers.rheaders());
  }
}
