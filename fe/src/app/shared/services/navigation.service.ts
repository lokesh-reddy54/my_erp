import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import _ from "lodash";

export interface IMenuItem {
  id?: string;
  title?: string;
  description?: string;
  type: string; // Possible values: link/dropDown/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sections?: Section[]; // Dropdown items
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
  active?: boolean;
}
export interface Section {
  name: string; // Display text
  sub?: IChildItem[];
}
export interface IChildItem {
  id?: string;
  parentId?: string;
  type?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;
  sub?: IChildItem[];
  active?: boolean;
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

interface ISidebarState {
  sidenavOpen?: boolean;
  childnavOpen?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class NavigationService {
  public sidebarState: ISidebarState = {
    sidenavOpen: true,
    childnavOpen: false,
  };
  user: any = {};

  constructor() {
    this.user = JSON.parse(localStorage.getItem("cwo_user"));
  }

  defaultMenu: IMenuItem[] = [
    {
      name: "Dashboard",
      description: "",
      type: "dropDown",
      icon: "i-Bar-Chart",
      sections: [
        {
          name: "Dashboard",
          sub: [
            {
              icon: "i-Bar-Chart",
              name: "HMT",
              state: "/dashboards/main",
              type: "link",
            },
            {
              icon: "i-Money-2",
              name: "Accounts",
              state: "/dashboards/accounts",
              type: "link",
            },
            // {
            //   icon: 'i-Money-2',
            //   name: 'Accounts',
            //   type: 'dropDown',
            //   sub: [
            //     { name: 'Project Capex', state: '/dashboards/accounts/capex', type: 'link' },
            //     { name: 'Building Expenses', state: '/dashboards/accounts/expenses', type: 'link' },
            //     { name: 'Product Revenue', state: '/dashboards/accounts/revenue', type: 'link' }
            //   ]
            // },
          ],
        },
        {
          name: "Number Cards",
          sub: [
            {
              icon: "i-Money-2",
              name: "Accounts",
              state: "/dashboards/cards/accounts",
              type: "link",
            },
          ],
        },
        {
          name: "Work Benches",
          sub: [
            {
              icon: "i-ID-3",
              name: "Sales",
              state: "/workbenches/sales",
              type: "link",
            },
            {
              icon: "i-ID-3",
              name: "Accounts",
              state: "/workbenches/accounts",
              type: "link",
            },
            {
              icon: "i-ID-3",
              name: "Business Ops",
              state: "/workbenches/businessops",
              type: "link",
            },
            {
              icon: "i-ID-3",
              name: "Building Ops",
              state: "/workbenches/buildingops",
              type: "link",
            },
            {
              icon: "i-ID-3",
              name: "Support",
              state: "/workbenches/support",
              type: "link",
            },
            {
              icon: "i-ID-3",
              name: "Purchases",
              state: "/workbenches/purchases",
              type: "link",
            },
            {
              icon: "i-ID-3",
              name: "Projects",
              state: "/workbenches/projects",
              type: "link",
            },
            {
              icon: "i-ID-3",
              name: "HMT",
              state: "/workbenches/hmt",
              type: "link",
            },
          ],
        },
      ],
    },
    {
      name: "Admin",
      description: "",
      type: "dropDown",
      icon: "i-Computer-Secure",
      sub: [
        {
          icon: "i-Atom",
          name: "My Company",
          state: "/admin/company",
          type: "link",
        },
        {
          icon: "i-Business-Mens",
          name: "Users",
          state: "/admin/users",
          type: "link",
        },
        {
          icon: "i-Map-Marker",
          name: "Locations",
          state: "/admin/locations",
          type: "link",
        },
        {
          icon: "i-Library",
          name: "Facilities",
          state: "/admin/facilities",
          type: "link",
        },
        {
          icon: "i-Building",
          name: "Offices",
          state: "/admin/offices",
          type: "link",
        },
        {
          icon: "i-Building",
          name: "Property Contracting",
          state: "/admin/properties",
          type: "link",
        },
        {
          icon: "i-Duplicate-Window",
          name: "External Systems",
          state: "/admin/externalsystems",
          type: "link",
        },
        // { icon: 'i-Big-Data', name: 'Service Providers', state: '/admin/serviceproviders', type: 'link' },
        {
          icon: "i-Financial",
          name: "PettyCash Accounts",
          state: "/admin/pettycashaccounts",
          type: "link",
        },
        {
          icon: "i-Credit-Card",
          name: "DebitCard Accounts",
          state: "/admin/debitcardaccounts",
          type: "link",
        },
        {
          icon: "i-Email",
          name: "Emails",
          state: "/admin/mails",
          type: "link",
        },
        {
          icon: "i-Gears",
          name: "Scheduler",
          state: "/admin/scheduler",
          type: "link",
        },
        {
          icon: "i-Speach-Bubble-3",
          name: "SMSes",
          state: "/admin/sms",
          type: "link",
        },
        {
          icon: "i-Speach-Bubble-Asking",
          name: "Help Notes",
          state: "/admin/helpnotes",
          type: "link",
        },
      ],
    },
    {
      name: "Bookings",
      description: "",
      type: "dropDown",
      icon: "i-Library",
      sub: [
        {
          icon: "i-Receipt-4",
          name: "Office Bookings",
          state: "/bookings/list",
          type: "link",
        },
        {
          icon: "i-Calendar",
          name: "Onboarding & Exits",
          state: "/bookings/schedules",
          type: "link",
        },
        {
          icon: "i-Receipt-4",
          name: "Resource Bookings",
          state: "/bookings/resourceBookings",
          type: "link",
        },
        {
          icon: "i-Calendar",
          name: "Resources Calendar",
          state: "/bookings/rcalendar",
          type: "link",
        },
        {
          icon: "i-Calendar",
          name: "Parking Bookings",
          state: "/bookings/parking",
          type: "link",
        },
        {
          icon: "i-Line-Chart",
          name: "Reports",
          type: "dropDown",
          sub: [
            {
              name: "Availability",
              state: "/bookings/availability",
              type: "link",
            },
            {
              name: "Product Analysis",
              state: "/bookings/products",
              type: "link",
            },
            {
              name: "Invoice Summary",
              state: "/bookings/inv-sum",
              type: "link",
            },
          ],
        },
        {
          icon: "i-Data-Refresh",
          name: "Contract Renewals",
          state: "/bookings/contract-renewals",
          type: "link",
        },
        {
          icon: "i-Speach-Bubble-12",
          name: "Notifications",
          state: "/bookings/notifications",
          type: "link",
        },
        {
          icon: "i-Speach-Bubble-12",
          name: "Invoices",
          state: "/bookings/invoices",
          type: "link",
        },
      ],
    },
    {
      name: "Purchases",
      description: "",
      type: "dropDown",
      icon: "i-Cash-register-2",
      sub: [
        {
          icon: "i-Receipt-4",
          name: "SKUs",
          state: "/purchases/skuslist",
          type: "link",
        },
        {
          icon: "i-Business-Mens",
          name: "Vendors",
          state: "/purchases/vendors",
          type: "link",
        },
        {
          icon: "i-Newspaper",
          name: "Work Orders",
          state: "/purchases/workorders",
          type: "link",
        },
        {
          icon: "i-Credit-Card",
          name: "Purchase Orders",
          state: "/purchases/purchaseorders",
          type: "link",
        },
        {
          icon: "i-Credit-Card",
          name: "Project Bills",
          state: "/purchases/projectbills",
          type: "link",
        },
        {
          icon: "i-Building",
          name: "Projects",
          state: "/purchases/projects",
          type: "link",
        },
        {
          icon: "i-Receipt-3",
          name: "Vendor Payouts",
          state: "/purchases/payouts",
          type: "link",
        },
        {
          icon: "i-Broke-Link-2",
          name: "Compliance",
          type: "dropDown",
          sub: [
            {
              name: "GST Compliance",
              state: "/purchases/gst-compliance",
              type: "link",
            },
            {
              name: "TDS Compliance",
              state: "/purchases/tds-compliance",
              type: "link",
            },
          ],
        },
        {
          icon: "i-Line-Chart",
          name: "Reports",
          type: "dropDown",
          sub: [
            {
              name: "Capex BuildingWise Payables",
              state: "/purchases/reports/buildingwise-payables",
              type: "link",
            },
            {
              name: "Capex ProjectWise Payables",
              state: "/purchases/reports/projectwise-payables",
              type: "link",
            },
            {
              name: "BuildingWise SKUs",
              state: "/purchases/reports/buildingwise-skus",
              type: "link",
            },
          ],
        },
        {
          icon: "i-Gears",
          name: "SetUp",
          type: "dropDown",
          sub: [
            { name: "SKUs", state: "/purchases/skus", type: "link" },
            { name: "SKU Units", state: "/purchases/skuunits", type: "link" },
            {
              name: "Compliance Terms",
              state: "/purchases/compliance-terms",
              type: "link",
            },
          ],
        },
      ],
    },
    {
      name: "Accounts",
      description: "",
      type: "dropDown",
      icon: "i-Money-2",
      sections: [
        {
          name: "Accounting",
          sub: [
            {
              icon: "i-Financial",
              name: "Credit Entries",
              state: "/accounts/payinentries",
              type: "link",
            },
            {
              icon: "i-Receipt-3",
              name: "Bill Queue",
              state: "/accounts/billsqueue",
              type: "link",
            },
            {
              icon: "i-Credit-Card",
              name: "Payouts",
              state: "/accounts/payouts",
              type: "link",
            },
            {
              icon: "i-Financial",
              name: "Debit Entries",
              state: "/accounts/payoutentries",
              type: "link",
            },
            {
              icon: "i-Line-Chart",
              name: "Reports",
              type: "dropDown",
              sub: [
                {
                  name: "Products List",
                  state: "/accounts/reports/productslist",
                  type: "link",
                },
                // { name: 'Revenue Invoices', state: '/accounts/reports/revenueinvoices', type: 'link' },
                {
                  name: "Invoices List",
                  state: "/accounts/reports/invoiceslist",
                  type: "link",
                },
                {
                  name: "Customers List",
                  state: "/accounts/reports/customerslist",
                  type: "link",
                },
                {
                  name: "Expense Bills",
                  state: "/accounts/reports/billslist",
                  type: "link",
                },
                {
                  name: "Vendors List",
                  state: "/accounts/reports/vendorslist",
                  type: "link",
                },
              ],
            },
          ],
        },
        {
          name: "Revenue",
          sub: [
            {
              icon: "i-Receipt-4",
              name: "Revenue Codes",
              state: "/accounts/invoiceservices",
              type: "link",
            },
            {
              icon: "i-Receipt-3",
              name: "Tenant Payments",
              state: "/accounts/payments",
              type: "link",
            },
            {
              icon: "i-Line-Chart",
              name: "Reports",
              type: "dropDown",
              sub: [
                {
                  name: "Revenue",
                  state: "/accounts/reports/revenue",
                  type: "link",
                },
                {
                  name: "SD Liability",
                  state: "/accounts/reports/liability",
                  type: "link",
                },
                { name: "AR", state: "/accounts/reports/ar", type: "link" },
                {
                  name: "TDS AR",
                  state: "/accounts/reports/tdsar",
                  type: "link",
                },
                {
                  name: "TDS Due Clients",
                  state: "/accounts/reports/tdsdueclients",
                  type: "link",
                },
              ],
            },
          ],
        },
        {
          name: "Building Expenses",
          sub: [
            {
              icon: "i-Gears",
              name: "SetUp",
              type: "dropDown",
              sub: [
                {
                  name: "Expense Codes",
                  state: "/accounts/opex/0",
                  type: "link",
                },
                {
                  name: "Recurring Expenses",
                  state: "/accounts/opexpayments/0",
                  type: "link",
                },
                // { name: 'Service Providers', state: '/accounts/serviceproviders', type: 'link' },
                // { name: 'Vendors', state: '/purchases/vendors', type: 'link' },
              ],
            },
            {
              icon: "i-Receipt-4",
              name: "Purchase Orders",
              state: "/accounts/expensepos/0",
              type: "link",
            },
            {
              icon: "i-Receipt-3",
              name: "Master Bills",
              state: "/accounts/billslist/0",
              type: "link",
            },
            {
              icon: "i-Calendar",
              name: "MonthWise Bills",
              state: "/accounts/opexbills/0",
              type: "link",
            },
            {
              icon: "i-Line-Chart",
              name: "Reports",
              type: "dropDown",
              sub: [
                {
                  name: "Expenses",
                  state: "/accounts/reports/expenses/0",
                  type: "link",
                },
                // { name: 'Opex', state: '/accounts/reports/opex/0', type: 'link' },
              ],
            },
          ],
        },
        {
          name: "HO Expenses",
          sub: [
            {
              icon: "i-Gears",
              name: "SetUp",
              type: "dropDown",
              sub: [
                {
                  name: "Expense Codes",
                  state: "/accounts/hoopex/1",
                  type: "link",
                },
                {
                  name: "Recurring Expenses",
                  state: "/accounts/hoopexpayments/1",
                  type: "link",
                },
              ],
            },
            {
              icon: "i-Receipt-4",
              name: "Purchase Orders",
              state: "/accounts/hoexpensepos/1",
              type: "link",
            },
            {
              icon: "i-Receipt-3",
              name: "Master Bills",
              state: "/accounts/hobillslist/1",
              type: "link",
            },
            {
              icon: "i-Calendar",
              name: "MonthWise Bills",
              state: "/accounts/hoopexbills/1",
              type: "link",
            },
            {
              icon: "i-Line-Chart",
              name: "Reports",
              type: "dropDown",
              sub: [
                {
                  name: "Expenses",
                  state: "/accounts/reports/expenses/1",
                  type: "link",
                },
                // { name: 'Opex', state: '/accounts/reports/opex/1', type: 'link' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Support",
      description: "",
      type: "dropDown",
      icon: "i-Support",
      sub: [
        {
          icon: "i-Receipt-4",
          name: "Tickets List",
          state: "/support/list",
          type: "link",
        },
        {
          icon: "i-Calendar",
          name: "Ticket SLAs",
          state: "/support/calendar",
          type: "link",
        },
        {
          icon: "i-Line-Chart",
          name: "Reports",
          state: "/support/reports",
          type: "link",
        },
        {
          icon: "i-Gear",
          name: "Configuration",
          state: "/support/configuration",
          type: "link",
        },
      ],
    },
    {
      name: "Assets",
      description: "",
      type: "dropDown",
      icon: "i-Jeep-2",
      sub: [
        {
          icon: "i-ID-3",
          name: "Register",
          state: "/assets/register",
          type: "link",
        },
        {
          icon: "i-Line-Chart",
          name: "Reports",
          type: "dropDown",
          sub: [
            {
              icon: "i-Line-Chart",
              name: "Reports",
              state: "/assets/reports",
              type: "link",
            },
          ],
        },
      ],
    },
    {
      name: "Leads",
      description: "",
      type: "dropDown",
      icon: "i-MaleFemale",
      sub: [
        {
          icon: "i-Receipt-4",
          name: "Leads List",
          state: "/leads/list",
          type: "link",
        },
        {
          icon: "i-Calendar",
          name: "Visit Schedules",
          state: "/leads/visits",
          type: "link",
        },
        {
          icon: "i-Line-Chart",
          name: "Reports",
          state: "/leads/reports",
          type: "link",
        },
      ],
    },
  ];

  getMenus(roles) {
    console.log("navigation service ::: getMenus : roles : ", roles);
    var menuItems: any = [];

    if (roles.dashboards && roles.dashboards.enable) {
      menuItems.push({
        name: "Dashboard",
        description: "",
        icon: "i-Bar-Chart",
        type: "dropDown",
        sub: [
          {
            icon: "i-Bar-Chart",
            name: "My Dashboard",
            state: "/dashboards/main",
            type: "link",
          },
          {
            icon: "i-ID-3",
            name: "My WorkBench",
            state: "/workbenches/main",
            type: "link",
          },
        ],
      });
    }
    if (roles.workbenches && roles.workbenches.enable) {
      var workbenches = {
        name: "Work Benches",
        description: "",
        icon: "i-ID-3",
        type: "dropDown",
        sub: [],
      };
      if (roles.workbenches.sales) {
        workbenches.sub.push({
          icon: "i-ID-3",
          name: "Sales",
          state: "/workbenches/sales",
          type: "link",
        });
      }
      if (roles.workbenches.accounts) {
        workbenches.sub.push({
          icon: "i-ID-3",
          name: "Accounts",
          state: "/workbenches/accounts",
          type: "link",
        });
      }
      if (roles.workbenches.businessops) {
        workbenches.sub.push({
          icon: "i-ID-3",
          name: "Business Ops",
          state: "/workbenches/businessops",
          type: "link",
        });
      }
      if (roles.workbenches.buildingops) {
        workbenches.sub.push({
          icon: "i-ID-3",
          name: "Building Ops",
          state: "/workbenches/buildingops",
          type: "link",
        });
      }
      if (roles.workbenches.support) {
        workbenches.sub.push({
          icon: "i-ID-3",
          name: "Support",
          state: "/workbenches/support",
          type: "link",
        });
      }
      if (roles.workbenches.purchases) {
        workbenches.sub.push({
          icon: "i-ID-3",
          name: "Purchases",
          state: "/workbenches/purchases",
          type: "link",
        });
      }
      if (roles.workbenches.projects) {
        workbenches.sub.push({
          icon: "i-ID-3",
          name: "Projects",
          state: "/workbenches/projects",
          type: "link",
        });
      }
      if (roles.workbenches.hmt) {
        workbenches.sub.push({
          icon: "i-ID-3",
          name: "HMT",
          state: "/workbenches/hmt",
          type: "link",
        });
      }

      if (workbenches.sub.length) {
        menuItems.push(workbenches);
      }
    }

    if (roles.admin && roles.admin.enable) {
      var admin = {
        name: "Admin",
        description: "",
        icon: "i-Bar-Chart",
        type: "dropDown",
        sub: [],
      };
      if (roles.admin.company) {
        admin.sub.push({
          icon: "i-Atom",
          name: "My Company",
          state: "/admin/company",
          type: "link",
        });
      }
      if (roles.admin.users) {
        admin.sub.push({
          icon: "i-Business-Mens",
          name: "Users",
          state: "/admin/users",
          type: "link",
        });
      }
      if (roles.admin.locations) {
        admin.sub.push({
          icon: "i-Map-Marker",
          name: "Locations",
          state: "/admin/locations",
          type: "link",
        });
      }
      if (roles.admin.offices) {
        admin.sub.push({
          icon: "i-Building",
          name: "Offices",
          state: "/admin/offices",
          type: "link",
        });
      }
      if (roles.admin.properties) {
        admin.sub.push({
          icon: "i-Building",
          name: "Property Contracting",
          state: "/admin/properties",
          type: "link",
        });
      }
      if (roles.admin.facilities) {
        admin.sub.push({
          icon: "i-Library",
          name: "Facilities",
          state: "/admin/facilities",
          type: "link",
        });
      }
      if (roles.admin.externalSystems) {
        admin.sub.push({
          icon: "i-Duplicate-Window",
          name: "External Systems",
          state: "/admin/externalsystems",
          type: "link",
        });
      }
      if (roles.admin.mails) {
        admin.sub.push({
          icon: "i-Email",
          name: "Emails",
          state: "/admin/mails",
          type: "link",
        });
      }
      if (roles.admin.sms) {
        admin.sub.push({
          icon: "i-Speach-Bubble-3",
          name: "SMSes",
          state: "/admin/sms",
          type: "link",
        });
      }
      if (roles.admin.scheduler) {
        admin.sub.push({
          icon: "i-Gears",
          name: "Scheduler",
          state: "/admin/scheduler",
          type: "link",
        });
      }
      if (roles.admin.helpNotes) {
        admin.sub.push({
          icon: "i-Speach-Bubble-Asking",
          name: "Help Notes",
          state: "/admin/helpnotes",
          type: "link",
        });
      }
      menuItems.push(admin);
    }

    if (roles.bookings && roles.bookings.enable) {
      var bookings = {
        name: "Bookings",
        description: "",
        type: "dropDown",
        icon: "i-Library",
        sub: [
          // { icon: 'i-Receipt-4', name: 'Resource Bookings', state: '/bookings/resourceBookings', type: 'link' },
          // { icon: 'i-Calendar', name: 'Resources Calendar', state: '/bookings/rcalendar', type: 'link' },
        ],
      };
      if (roles.bookings.list) {
        bookings.sub.push({
          icon: "i-Receipt-4",
          name: "Office Bookings",
          state: "/bookings/list",
          type: "link",
        });
        bookings.sub.push({
          icon: "i-Calendar",
          name: "Parking Bookings",
          state: "/bookings/parking",
          type: "link",
        });
      }
      if (roles.bookings.onboardingExits) {
        bookings.sub.push({
          icon: "i-Calendar",
          name: "Onboarding & Exits",
          state: "/bookings/schedules",
          type: "link",
        });
      }
      if (roles.bookings.resourceBookings) {
        bookings.sub.push({
          icon: "i-Receipt-4",
          name: "Resource Bookings",
          state: "/bookings/resourceBookings",
          type: "link",
        });
        bookings.sub.push({
          icon: "i-Calendar",
          name: "Resources Calendar",
          state: "/bookings/rcalendar",
          type: "link",
        });
      }
      if (roles.bookings.reports) {
        bookings.sub.push({
          icon: "i-Line-Chart",
          name: "Reports",
          type: "dropDown",
          sub: [
            {
              name: "Availability",
              state: "/bookings/availability",
              type: "link",
            },
          ],
        });
      }
      if (roles.bookings.contractRenewals) {
        bookings.sub.push({
          icon: "i-Data-Refresh",
          name: "Contract Renewals",
          state: "/bookings/contract-renewals",
          type: "link",
        });
      }
      if (roles.bookings.notifications) {
        bookings.sub.push({
          icon: "i-Speach-Bubble-12",
          name: "Notifications",
          state: "/bookings/notifications",
          type: "link",
        });
      }
      menuItems.push(bookings);
    }

    if (roles.purchases && roles.purchases.enable) {
      var purchases = {
        name: "Purchases",
        description: "",
        type: "dropDown",
        icon: "i-Cash-register-2",
        sub: [],
      };
      if (roles.purchases.skus) {
        purchases.sub.push({
          icon: "i-Receipt-4",
          name: "SKUs",
          state: "/purchases/skus",
          type: "link",
        });
      }
      if (roles.purchases.assets) {
        purchases.sub.push({
          icon: "i-ID-3",
          name: "Assets",
          state: "/purchases/assets",
          type: "link",
        });
      }
      if (roles.purchases.vendors) {
        purchases.sub.push({
          icon: "i-Business-Mens",
          name: "Vendors",
          state: "/purchases/vendors",
          type: "link",
        });
      }
      if (roles.purchases.viewWorkOrders) {
        purchases.sub.push({
          icon: "i-Newspaper",
          name: "Work Orders",
          state: "/purchases/workorders",
          type: "link",
        });
      }
      if (roles.purchases.viewPurchaseOrders) {
        purchases.sub.push({
          icon: "i-Credit-Card",
          name: "Purchase Orders",
          state: "/purchases/purchaseorders",
          type: "link",
        });
      }
      if (roles.purchases.viewPurchaseOrders) {
        purchases.sub.push({
          icon: "i-Credit-Card",
          name: "Project Bills",
          state: "/purchases/projectbills",
          type: "link",
        });
      }
      if (roles.purchases.viewProjects) {
        purchases.sub.push({
          icon: "i-Building",
          name: "Projects",
          state: "/purchases/projects",
          type: "link",
        });
      }
      if (roles.purchases.tdsCompliance || roles.purchases.poGstVerification) {
        var citem = {
          icon: "i-Broke-Link-2",
          name: "Compliance",
          type: "dropDown",
          sub: [],
        };
        if (roles.purchases.poGstVerification) {
          citem.sub.push({
            name: "GST Compliance",
            state: "/purchases/gst-compliance",
            type: "link",
          });
        }
        if (roles.purchases.tdsCompliance) {
          citem.sub.push({
            name: "TDS Compliance",
            state: "/purchases/tds-compliance",
            type: "link",
          });
        }
        purchases.sub.push(citem);
      }
      var reports = {
        icon: "i-Line-Chart",
        name: "Reports",
        type: "dropDown",
        sub: [],
      };
      if (roles.purchases.buildingPayablesReport) {
        reports.sub.push({
          name: "Capex BuildingWise Payables",
          state: "/purchases/reports/buildingwise-payables",
          type: "link",
        });
        reports.sub.push({
          name: "Capex ProjectWise Payables",
          state: "/purchases/reports/projectwise-payables",
          type: "link",
        });
      }
      if (reports.sub.length) {
        purchases.sub.push(reports);
      }
      menuItems.push(purchases);
    }

    if (roles.accounts && roles.accounts.enable) {
      var accounts = {
        name: "Accounts",
        description: "",
        type: "dropDown",
        icon: "i-Money-2",
        sections: [],
      };
      var accounting: any = [];
      var revenue: any = [];
      var buildingExpenses: any = [];
      var hoExpenses: any = [];
      if (roles.accounts.listCreditEntries) {
        accounting.push({
          icon: "i-Financial",
          name: "Credit Entries",
          state: "/accounts/payinentries",
          type: "link",
        });
      }
      if (roles.accounts.listBillsQueue) {
        accounting.push({
          icon: "i-Receipt-3",
          name: "Bill Queue",
          state: "/accounts/billsqueue",
          type: "link",
        });
      }
      if (roles.accounts.listPayouts) {
        accounting.push({
          icon: "i-Credit-Card",
          name: "Payouts",
          state: "/accounts/payouts",
          type: "link",
        });
      }
      if (roles.accounts.listDebitEntries) {
        accounting.push({
          icon: "i-Financial",
          name: "Debit Entries",
          state: "/accounts/payoutentries",
          type: "link",
        });
      }
      if (roles.accounts.accountingReports) {
        accounting.push({
          icon: "i-Line-Chart",
          name: "Reports",
          type: "dropDown",
          sub: [
            {
              name: "Products List",
              state: "/accounts/reports/productslist",
              type: "link",
            },
            // { name: 'Revenue Invoices', state: '/accounts/reports/revenueinvoices', type: 'link' },
            {
              name: "Invoices List",
              state: "/accounts/reports/invoiceslist",
              type: "link",
            },
            {
              name: "Customers List",
              state: "/accounts/reports/customerslist",
              type: "link",
            },
            {
              name: "Expense Bills",
              state: "/accounts/reports/billslist",
              type: "link",
            },
            {
              name: "Vendors List",
              state: "/accounts/reports/vendorslist",
              type: "link",
            },
          ],
        });
      }

      if (roles.accounts.listRevenueCodes) {
        revenue.push({
          icon: "i-Receipt-4",
          name: "Revenue Codes",
          state: "/accounts/invoiceservices",
          type: "link",
        });
      }
      if (roles.accounts.paymentsList) {
        revenue.push({
          icon: "i-Receipt-3",
          name: "Tenant Payments",
          state: "/accounts/payments",
          type: "link",
        });
      }
      if (roles.accounts.revenueReports) {
        revenue.push({
          icon: "i-Line-Chart",
          name: "Reports",
          type: "dropDown",
          sub: [
            {
              name: "Revenue",
              state: "/accounts/reports/revenue",
              type: "link",
            },
            {
              name: "SD Liability",
              state: "/accounts/reports/liability",
              type: "link",
            },
            { name: "AR", state: "/accounts/reports/ar", type: "link" },
            { name: "TDS AR", state: "/accounts/reports/tdsar", type: "link" },
            {
              name: "TDS Due Clients",
              state: "/accounts/reports/tdsdueclients",
              type: "link",
            },
          ],
        });
      }

      if (
        roles.accounts.manageExpenseCodes ||
        roles.accounts.manageRecurringBills
      ) {
        buildingExpenses.push({
          icon: "i-Gears",
          name: "SetUp",
          type: "dropDown",
          sub: [
            { name: "Expense Codes", state: "/accounts/opex/0", type: "link" },
            {
              name: "Recurring Expenses",
              state: "/accounts/opexpayments/0",
              type: "link",
            },
          ],
        });
        hoExpenses.push({
          icon: "i-Gears",
          name: "SetUp",
          type: "dropDown",
          sub: [
            { name: "Expense Codes", state: "/accounts/opex/1", type: "link" },
            {
              name: "Recurring Expenses",
              state: "/accounts/opexpayments/1",
              type: "link",
            },
          ],
        });
      }

      if (roles.accounts.listPOs) {
        buildingExpenses.push({
          icon: "i-Receipt-4",
          name: "Purchase Orders",
          state: "/accounts/expensepos/0",
          type: "link",
        });
        hoExpenses.push({
          icon: "i-Receipt-4",
          name: "Purchase Orders",
          state: "/accounts/expensepos/1",
          type: "link",
        });
      }
      if (roles.accounts.listBills) {
        buildingExpenses.push({
          icon: "i-Receipt-3",
          name: "Master Bills",
          state: "/accounts/billslist/0",
          type: "link",
        });
        hoExpenses.push({
          icon: "i-Receipt-3",
          name: "Master Bills",
          state: "/accounts/billslist/1",
          type: "link",
        });
      }
      if (roles.accounts.monthWiseBills) {
        buildingExpenses.push({
          icon: "i-Calendar",
          name: "MonthWise Bills",
          state: "/accounts/opexbills/0",
          type: "link",
        });
        hoExpenses.push({
          icon: "i-Calendar",
          name: "MonthWise Bills",
          state: "/accounts/opexbills/1",
          type: "link",
        });
      }
      if (roles.accounts.expenseReports) {
        buildingExpenses.push({
          icon: "i-Line-Chart",
          name: "Reports",
          type: "dropDown",
          sub: [
            {
              name: "Expenses",
              state: "/accounts/reports/expenses/0",
              type: "link",
            },
            // { name: 'Opex', state: '/accounts/reports/opex/0', type: 'link' }
          ],
        });
        hoExpenses.push({
          icon: "i-Line-Chart",
          name: "Reports",
          type: "dropDown",
          sub: [
            {
              name: "Expenses",
              state: "/accounts/reports/expenses/1",
              type: "link",
            },
            // { name: 'Opex', state: '/accounts/reports/opex/0', type: 'link' }
          ],
        });
      }

      if (accounting.length) {
        accounts.sections.push({
          name: "Accounting",
          sub: accounting,
        });
      }
      if (revenue.length) {
        accounts.sections.push({
          name: "Revenue",
          sub: revenue,
        });
      }
      if (buildingExpenses.length) {
        accounts.sections.push({
          name: "Building Expenses",
          sub: buildingExpenses,
        });
      }
      if (hoExpenses.length) {
        accounts.sections.push({
          name: "HO Expenses",
          sub: hoExpenses,
        });
      }
      menuItems.push(accounts);
    }

    if (roles.leads && roles.leads.enable) {
      var leads = {
        name: "Leads",
        description: "",
        type: "dropDown",
        icon: "i-MaleFemale",
        sub: [],
      };
      if (roles.leads.list) {
        leads.sub.push({
          icon: "i-Receipt-4",
          name: "Leads List",
          state: "/leads/list",
          type: "link",
        });
      }
      if (roles.leads.visits) {
        leads.sub.push({
          icon: "i-Calendar",
          name: "Visit Schedules",
          state: "/leads/visits",
          type: "link",
        });
      }
      if (roles.leads.reports) {
        leads.sub.push({
          icon: "i-Line-Chart",
          name: "Reports",
          state: "/leads/reports",
          type: "link",
        });
      }
      menuItems.push(leads);
    }

    if (roles.assets && roles.assets.enable) {
      var assets = {
        name: "Assets",
        description: "",
        type: "dropDown",
        icon: "i-Jeep-2",
        sub: [
          { icon: "i-ID-3", name: "List", state: "/assets/list", type: "link" },
        ],
      };
      if (roles.assets.reports) {
        assets.sub.push({
          icon: "i-Line-Chart",
          name: "Reports",
          state: "/assets/reports",
          type: "link",
        });
      }
      menuItems.push(assets);
    }

    if (roles.support && roles.support.enable) {
      menuItems.push({
        name: "Support",
        description: "",
        type: "dropDown",
        icon: "i-Support",
        sub: [
          {
            icon: "i-Receipt-4",
            name: "Tickets List",
            state: "/support/list",
            type: "link",
          },
          {
            icon: "i-Calendar",
            name: "Ticket SLAs",
            state: "/support/calendar",
            type: "link",
          },
          {
            icon: "i-Line-Chart",
            name: "Reports",
            state: "/support/reports",
            type: "link",
          },
          {
            icon: "i-Gear",
            name: "Configuration",
            state: "/support/configuration",
            type: "link",
          },
        ],
      });
    }

    return menuItems;
  }

  clientMenu: IMenuItem[] = [
    {
      name: "Dashboard",
      description: "",
      icon: "i-Bar-Chart",
      type: "dropDown",
      sub: [
        {
          icon: "i-Library",
          name: "OverAll",
          state: "/dashboards/client",
          type: "link",
        },
      ],
    },
    {
      name: "Bookings",
      description: "",
      type: "dropDown",
      icon: "i-Library",
      sub: [
        {
          icon: "i-Receipt-4",
          name: "Offices",
          state: "/client/bookings",
          type: "link",
        },
        {
          icon: "i-Receipt",
          name: "Resources",
          state: "/client/resource-bookings",
          type: "link",
        },
        {
          icon: "i-Receipt",
          name: "Credit Balance",
          state: "/client/credits",
          type: "link",
        },
        {
          icon: "i-Remove",
          name: "Exit Requests",
          state: "/client/exit-requests",
          type: "link",
        },
      ],
    },
    {
      name: "Support",
      description: "",
      type: "dropDown",
      icon: "i-Support",
      sub: [
        {
          icon: "i-Receipt-4",
          name: "Tickets List",
          state: "/client/tickets",
          type: "link",
        },
      ],
    },
    // {
    //   name: 'Visits',
    //   description: '',
    //   icon: 'i-Business-Mens',
    //   type: 'dropDown',
    //   sub: [
    //     { icon: 'i-Geek', name: 'Visits', state: '/client/visits', type: 'link' },
    //     { icon: 'i-MaleFemale', name: 'Visitors', state: '/client/visitors', type: 'link' },
    //     { icon: 'i-ID-3', name: 'Subscriptions', state: '/client/subscriptions', type: 'link' }
    //   ]
    // }
  ];

  menuItems = new BehaviorSubject<IMenuItem[]>(this.defaultMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();

  // You can customize this method to supply different menu for
  // different user type.
  publishNavigationChange(userType: string, roles?: any) {
    this.user = JSON.parse(localStorage.getItem("cwo_user"));
    switch (userType) {
      case "admin":
        var menuItems = this.defaultMenu;
        // if (this.user.roles) {
        //   menuItems = this.getMenus(this.user.roles);
        // } 
        // else if (this.user.companyId == 1) {
        //   var admin = _.find(menuItems, { name: "Admin" });
        //   if (admin) {
        //     admin.sub.unshift({
        //       icon: "i-Atom",
        //       name: "Client Companies",
        //       state: "/admin/clientcompanies",
        //       type: "link",
        //     });
        //   }
        // }
        // if (!this.user.modules.bookings) {
        //   menuItems = _.reject(menuItems, { name: "Bookings" });
        // }
        // if (!this.user.modules.accounts) {
        //   menuItems = _.reject(menuItems, { name: "Accounts" });
        // }
        // if (!this.user.modules.purchases) {
        //   menuItems = _.reject(menuItems, { name: "Purchases" });
        // }
        // if (!this.user.modules.support) {
        //   menuItems = _.reject(menuItems, { name: "Support" });
        // }
        // if (!this.user.modules.assets) {
        //   menuItems = _.reject(menuItems, { name: "Assets" });
        // }
        // if (!this.user.modules.leads) {
        //   menuItems = _.reject(menuItems, { name: "Leads" });
        // }
        this.menuItems.next(menuItems);
        console.log("menuItems :: ", menuItems);
        break;
      case "client":
        this.menuItems.next(this.clientMenu);
        break;

      case "sa":
        var menuItems = this.defaultMenu;
        break;
      case "support":
        var menuItems = this.defaultMenu;
        if (this.user.roles) {
          menuItems = this.getMenus(this.user.roles);
        } 
        this.menuItems.next(menuItems);
        break;
      default:
        this.menuItems.next(this.defaultMenu);
    }
  }
}
