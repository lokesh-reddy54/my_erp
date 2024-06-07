import * as moment from "moment";

export class Utils {
    static isMobile() {
        return window && window.matchMedia('(max-width: 767px)').matches;
    }
    static toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
    static getGreetingText = () => {
        const now = moment()
        const currentHour = now.local().hour()
        if (currentHour >= 12 && currentHour <= 17) return "Good Afternoon"
        else if (currentHour <= 18) return "Good Evening"
        else return "Good Morning"
    }
    static ngbDateToMoment(ngbDate: { month, day, year }) {
        if (!ngbDate) {
            return null;
        }
        if (ngbDate.day) {
            return moment(new Date(`${ngbDate.month}/${ngbDate.day}/${ngbDate.year}`));
        } else {
            return moment(ngbDate);
        }
    }
    static ngbDateToDate(ngbDate: { month, day, year }) {
        if (!ngbDate) {
            return null;
        }
        if (ngbDate.day) {
            return new Date(`${ngbDate.month}/${ngbDate.day}/${ngbDate.year}`);
        } else {
            return ngbDate;
        }
    }
    static dateToNgbDate(date: Date) {
        if (!date) {
            return null;
        }
        date = new Date(date);
        return { month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear() };
    }
    static scrollToTop(selector: string) {
        if (document) {
            const element = <HTMLElement>document.querySelector(selector);
            element.scrollTop = 0;
        }
    }
    static genId() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}
